import {createRemoteJWKSet, jwtVerify} from 'jose';

// Public Cognito configuration used by the native app. Never trust an issuer or
// key URL supplied in a request. JWTs are used in memory and are never persisted.
export const ACCOUNT_ISSUER = 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_qqhdEFTFP';
export const ACCOUNT_CLIENT_ID = '6bfe78a2speeburauqnmaog4l5';
const accountKeys = createRemoteJWKSet(new URL(`${ACCOUNT_ISSUER}/.well-known/jwks.json`));
const encoder = new TextEncoder();
const reply = (body, status = 200) => Response.json(body, {status, headers: {
 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'
}});
const validEmail = value => typeof value === 'string' && value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);

export function processingDays(env) {
 const value = String(env.ACCOUNT_DELETION_WINDOW_DAYS ?? '');
 return /^[1-9]\d{0,2}$/.test(value) && Number(value) <= 90 ? Number(value) : null;
}

export async function verifyAccount(request, resolveKey = accountKeys) {
 const authorization = request.headers.get('Authorization') ?? '';
 if (!/^Bearer [A-Za-z0-9_.-]+$/.test(authorization) || authorization.length > 16384) throw new Error('Unauthorized');
 const {payload} = await jwtVerify(authorization.slice(7), resolveKey, {
  issuer: ACCOUNT_ISSUER, audience: ACCOUNT_CLIENT_ID, algorithms: ['RS256'],
  requiredClaims: ['exp', 'iat', 'sub', 'token_use'], clockTolerance: 0
 });
 if (payload.token_use !== 'id' || !/^[0-9a-f-]{36}$/i.test(payload.sub) ||
     payload.iat > Math.floor(Date.now() / 1000) + 60 || !validEmail(payload.email) ||
     typeof payload['cognito:username'] !== 'string' || payload['cognito:username'].length > 128 || !payload['cognito:username']) {
  throw new Error('Unauthorized');
 }
 let identities = payload.identities;
 if (typeof identities === 'string') { try { identities = JSON.parse(identities); } catch { identities = []; } }
 const providers = Array.isArray(identities) ? identities.map(i => i?.providerName)
  .filter(p => typeof p === 'string' && /^[\w .-]{1,80}$/.test(p)).slice(0,10) : [];
 return {sub: payload.sub, username: payload['cognito:username'], email: payload.email,
  emailVerified: payload.email_verified === true, providers};
}

function snapshot(account, row, env) {
 return {accountID: account.sub, accountEmail: row?.email ?? account.email, processingDays: processingDays(env), request: row ? {
  id: row.id, status: row.status, createdAt: new Date(row.created_at).toISOString(),
  dueAt: new Date(row.due_at).toISOString(), processingDays: row.processing_days,
  completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null
 } : null};
}

async function readBody(request) {
 if (Number(request.headers.get('Content-Length')) > 2048) throw new Error('too-large');
 const reader = request.body?.getReader();
 if (!reader) throw new Error('invalid-json');
 let size = 0;
 const chunks = [];
 while (true) {
  const {value, done} = await reader.read();
  if (done) break;
  size += value.byteLength;
  if (size > 2048) { await reader.cancel(); throw new Error('too-large'); }
  chunks.push(value);
 }
 const bytes = new Uint8Array(size);
 let offset = 0;
 for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
 return JSON.parse(new TextDecoder().decode(bytes));
}

async function allowRequest(env, sub) {
 const day = Math.floor(Date.now() / 86400000);
 const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(sub))), b => b.toString(16).padStart(2,'0')).join('');
 // Separate from support intake. Reopening Settings or retrying a saved request
 // does not consume an intake slot. The unique account constraint is authoritative.
 for (const [key, max] of [[`deletion:account:${hash}:${day}`,5], [`deletion:global:${day}`,200]]) {
  const row = await env.DB.prepare('INSERT INTO support_rate_limits(key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count')
   .bind(key, (day+1)*86400000).first();
  if (row.count > max) return false;
 }
 return true;
}

export async function notifyDeletion(env, row) {
 const now = Date.now();
 const claim = await env.DB.prepare(`UPDATE account_deletion_requests SET notification_claimed_at=?, notification_attempts=notification_attempts+1
  WHERE id=? AND status='scheduled' AND notification_sent_at IS NULL AND notification_next_attempt_at<=?
  AND (notification_claimed_at IS NULL OR notification_claimed_at<?) RETURNING notification_attempts`)
  .bind(now, row.id, now, now-300000).first();
 if (!claim) return;
 try {
  await env.EMAIL.send({from: 'support@linkpower.app', to: 'brianranglin@gmail.com', replyTo: row.email,
   subject: `LinkPower account deletion request ${row.id}`,
   text: `A signed-in user requested permanent deletion of their PeakDo account and associated data. Manual action is required.\n\nRequest: ${row.id}\nReceived: ${new Date(row.created_at).toISOString()}\nComplete by: ${new Date(row.due_at).toISOString()} (${row.processing_days} days promised)\n\nCognito issuer: ${ACCOUNT_ISSUER}\nAccount sub (verified): ${row.account_sub}\nCognito username: ${row.account_username}\nAccount email: ${row.email}\nEmail verified by Cognito: ${Boolean(row.email_verified)}\nLinked sign-in providers: ${row.linked_providers}\nSuperwall appUserId (client-supplied reference only): ${row.app_user_id ?? 'not supplied'}\n\nRemove the PeakDo account AND associated data using the authorized vendor/admin process. Revoke Sign in with Apple tokens when applicable. Handle LinkPower-held records under the privacy policy; do not delete unrelated accounts based on the client-supplied Superwall reference alone.\n\nAfter completion, reply to this email to confirm completion to the customer, then mark the request completed using scripts/account-deletions.mjs. The current email binding notifies you only; it does not email the customer.\n\nThis request does not cancel an App Store subscription. No account or data has been deleted by this API.\n`});
  await env.DB.prepare('UPDATE account_deletion_requests SET notification_sent_at=?, notification_error=NULL, notification_claimed_at=NULL WHERE id=?')
   .bind(Date.now(), row.id).run();
 } catch {
  // Never store the thrown email-provider error: it can contain personal data.
  const retryAt = Date.now() + Math.min(86400000, 600000 * 2 ** Math.min(claim.notification_attempts-1,8));
  await env.DB.prepare('UPDATE account_deletion_requests SET notification_error=?, notification_claimed_at=NULL, notification_next_attempt_at=? WHERE id=?')
   .bind('Owner notification failed; scheduled for retry.', retryAt, row.id).run();
  console.error('accountDeletionNotification_fail', row.id);
 }
}

export async function retryDeletionNotifications(env) {
 const rows = await env.DB.prepare(`SELECT * FROM account_deletion_requests WHERE status='scheduled'
  AND notification_sent_at IS NULL AND notification_next_attempt_at<=? ORDER BY created_at LIMIT 20`).bind(Date.now()).all();
 for (const row of rows.results) await notifyDeletion(env, row);
}

// The optional key resolver is a test seam; production always uses the pinned
// Cognito JWKS above. A client cannot supply or replace it.
export async function handleAccountDeletion(request, env, ctx, resolveKey = accountKeys) {
 if (!['GET', 'POST'].includes(request.method)) return reply({error: 'Method not allowed.'},405);
 let account;
 try { account = await verifyAccount(request, resolveKey); }
 catch { return reply({error: 'Please sign in to your PeakDo account again, then retry.'},401); }
 try {
  const existing = await env.DB.prepare('SELECT * FROM account_deletion_requests WHERE account_sub=?').bind(account.sub).first();
  if (request.method === 'GET') return reply(snapshot(account, existing, env));
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply({error: 'Expected JSON.'},415);
  let body;
  try { body = await readBody(request); }
  catch (error) { return reply({error: error.message === 'too-large' ? 'Request is too large.' : 'Invalid JSON.'}, error.message === 'too-large' ? 413 : 400); }
  if (!body || body.confirm !== true || !Number.isInteger(body.processingDays) ||
      (body.appUserId != null && (typeof body.appUserId !== 'string' || body.appUserId.length > 512 || /[\u0000-\u001f\u007f]/.test(body.appUserId)))) {
   return reply({error: 'Confirm account deletion before submitting.'},400);
  }
  if (existing) {
   ctx.waitUntil(notifyDeletion(env, existing));
   return reply(snapshot(account, existing, env));
  }
  const days = processingDays(env);
  if (!days) return reply({error: 'Account deletion requests are temporarily unavailable. Please try again later.'},503);
  if (body.processingDays !== days) return reply({error: 'The deletion timeframe has changed. Refresh this screen and review it before confirming.'},409);
  if (!await allowRequest(env, account.sub)) return reply({error: 'Too many requests. Please try again later.'},429);
  const id = crypto.randomUUID(), now = Date.now();
  await env.DB.prepare(`INSERT OR IGNORE INTO account_deletion_requests
   (id,account_sub,account_username,email,email_verified,linked_providers,app_user_id,created_at,due_at,processing_days)
   VALUES (?,?,?,?,?,?,?,?,?,?)`).bind(id, account.sub, account.username, account.email, account.emailVerified ? 1 : 0,
   JSON.stringify(account.providers), body.appUserId || null, now, now+days*86400000, days).run();
  const row = await env.DB.prepare('SELECT * FROM account_deletion_requests WHERE account_sub=?').bind(account.sub).first();
  if (!row) throw new Error('Save failed');
  ctx.waitUntil(notifyDeletion(env, row));
  return reply(snapshot(account, row, env), row.id === id ? 201 : 200);
 } catch {
  console.error('accountDeletionRequest_fail');
  return reply({error: 'Unable to save your request. Please retry. If it was already saved, retrying will retrieve the same receipt.'},503);
 }
}
