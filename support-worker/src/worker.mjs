import {handleAccountDeletion, retryDeletionNotifications} from './account-deletion.mjs';

const MAX_BYTES = 25 * 1024 * 1024;
const encoder = new TextEncoder();
const response = (body, status = 200) => Response.json(body, {status, headers: {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function digest(value) {
 return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',typeof value === 'string' ? encoder.encode(value) : value)), b=>b.toString(16).padStart(2,'0')).join('');
}
export function validate(body) {
 if (!body || typeof body !== 'object') return 'Invalid request.';
 if (typeof body.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.id)) return 'Invalid request identifier.';
 if (typeof body.email !== 'string' || body.email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(body.email) || /[\r\n]/.test(body.email)) return 'Enter a valid email address.';
 if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 10000) return 'Enter a message of up to 10,000 characters.';
 if (typeof body.appUserId !== 'string' || !body.appUserId.trim() || body.appUserId.length > 512) return 'Missing app user ID.';
 if (!body.diagnostics || typeof body.diagnostics !== 'object' || Array.isArray(body.diagnostics)) return 'Missing diagnostic bundle.';
 return null;
}
async function limitedBody(request) {
 if (Number(request.headers.get('Content-Length')) > MAX_BYTES) throw new Error('too-large');
 const reader = request.body?.getReader(); if (!reader) throw new Error('invalid-json');
 const chunks=[]; let size=0;
 while (true) { const {value,done}=await reader.read(); if(done) break; size+=value.byteLength; if(size>MAX_BYTES) {await reader.cancel();throw new Error('too-large');} chunks.push(value); }
 const data = new Uint8Array(size); let offset=0; for(const c of chunks){data.set(c,offset);offset+=c.length;} return data;
}
export async function downloadToken(env, id, expires) {
 const key=await crypto.subtle.importKey('raw',encoder.encode(env.SUPPORT_LINK_KEY),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,encoder.encode(`${id}:${expires}`))),b=>b.toString(16).padStart(2,'0')).join('');
}
// Files the request in the mail-sync inbox (mail.brikki.org) as mail from the customer to support@linkpower.app,
// with the diagnostics attached. Returns false when the inbox isn't configured, so the email fallback runs.
async function deliverToInbox(env, row, url) {
 if(!env.MAIL_SYNC||!env.MAIL_SYNC_FORM_TOKEN) return false;
 let diagnostics=null;
 if(row.payload_bytes<=10*1024*1024) {
  const object=await env.DIAGNOSTICS.get(row.object_key);
  if(object) { try { diagnostics=JSON.parse(await object.text()).diagnostics??null; } catch {} }
 }
 const res=await env.MAIL_SYNC.fetch(`https://mail-sync/forms/${env.MAIL_SYNC_ACCOUNT||'brian'}/linkpower-support`,{method:'POST',
  headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.MAIL_SYNC_FORM_TOKEN}`,'Idempotency-Key':row.id},
  body:JSON.stringify({email:row.email,message:row.message,appUserId:row.app_user_id,request:row.id,
   diagnosticsLink:url,diagnosticsSize:`${row.payload_bytes} bytes`,...(diagnostics?{diagnostics}:{})})});
 if(!res.ok) throw new Error(`mail-sync returned ${res.status}`);
 return true;
}
async function notify(env, row) {
 const now=Date.now();
 const claim=await env.DB.prepare('UPDATE support_requests SET notification_claimed_at=?, notification_attempts=notification_attempts+1 WHERE id=? AND notification_sent_at IS NULL AND (notification_claimed_at IS NULL OR notification_claimed_at<?) RETURNING id').bind(now,row.id,now-300000).first();
 if(!claim) return;
 try {
  const expires=now+7*86400000;
  const token=await downloadToken(env,row.id,expires);
  const url=`https://linkpower.app/api/support/${row.id}/diagnostics?expires=${expires}&token=${token}`;
  let delivered=false;
  try { delivered=await deliverToInbox(env,row,url); }
  catch(error) { console.error('Support inbox delivery failed; emailing instead',row.id,String(error)); }
  if(!delivered) await env.EMAIL.send({from:'support@linkpower.app',to:'brianranglin@gmail.com',replyTo:row.email,
   subject:`LinkPower support request ${row.id}`,
   text:`Email: ${row.email}\nSuperwall appUserId: ${row.app_user_id}\nRequest: ${row.id}\n\n${row.message}\n\nPrivate diagnostics (link expires in 7 days; keep private):\n${url}\n\nSize: ${row.payload_bytes} bytes\n`});
  await env.DB.prepare('UPDATE support_requests SET notification_sent_at=?, notification_error=NULL WHERE id=?').bind(Date.now(),row.id).run();
 } catch(error) {
  console.error('Support notification failed',row.id,String(error));
  await env.DB.prepare('UPDATE support_requests SET notification_error=?, notification_claimed_at=NULL WHERE id=?').bind(String(error).slice(0,1000),row.id).run();
 }
}
async function rateLimit(env, ip) {
 const now=Date.now(), hour=Math.floor(now/3600000), day=Math.floor(now/86400000);
 for (const [key,max,expiry] of [[`ip:${await digest(ip)}:${hour}`,5,(hour+1)*3600000],[`global:${day}`,200,(day+1)*86400000]]) {
  const row=await env.DB.prepare('INSERT INTO support_rate_limits(key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,expiry).first();
  if(row.count>max) return false;
 }
 return true;
}
export default {
 async fetch(request,env,ctx) {
  try {
   const url=new URL(request.url);
   if(url.pathname==='/api/account-deletion') return handleAccountDeletion(request,env,ctx);
   const match=url.pathname.match(/^\/api\/support\/([0-9a-f-]{36})\/diagnostics$/i);
   if(match && request.method==='GET') {
    const expires=Number(url.searchParams.get('expires')),token=url.searchParams.get('token')||'';
    if(!Number.isSafeInteger(expires)||expires<Date.now()||expires>Date.now()+7*86400000||token.length!==64) return response({error:'Link expired or invalid.'},403);
    const expected=await downloadToken(env,match[1],expires);
    let different=0; for(let i=0;i<64;i++) different|=token.charCodeAt(i)^expected.charCodeAt(i);
    if(different) return response({error:'Link expired or invalid.'},403);
    const row=await env.DB.prepare('SELECT object_key FROM support_requests WHERE id=?').bind(match[1]).first();
    const object=row && await env.DIAGNOSTICS.get(row.object_key);
    if(!object) return response({error:'Not found.'},404);
    return new Response(object.body,{headers:{'Content-Type':'application/json','Content-Disposition':`attachment; filename="linkpower-support-${match[1]}.json"`,'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'}});
   }
   if(url.pathname!=='/api/support' || request.method!=='POST') return response({error:'Not found.'},404);
   if(!request.headers.get('content-type')?.startsWith('application/json')) return response({error:'Expected JSON.'},415);
   if(!await rateLimit(env,request.headers.get('CF-Connecting-IP')||'unknown')) return response({error:'Too many requests. Please try again later.'},429);
   let bytes,body;
   try {bytes=await limitedBody(request);body=JSON.parse(new TextDecoder().decode(bytes));}
   catch(error){return response({error:error.message==='too-large'?'Diagnostics exceed the 25 MiB upload limit.':'Invalid JSON.'},error.message==='too-large'?413:400);}
   const error=validate(body); if(error) return response({error},400);
   const sha=await digest(bytes);
   const existing=await env.DB.prepare('SELECT * FROM support_requests WHERE id=?').bind(body.id).first();
   if(existing) {
    if(existing.payload_sha256!==sha) return response({error:'Request identifier already used.'},409);
    ctx.waitUntil(notify(env,existing)); return response({id:body.id,saved:true});
   }
   const objectKey=`requests/${body.id}/${sha}.json`;
   await env.DIAGNOSTICS.put(objectKey,bytes,{httpMetadata:{contentType:'application/json'}});
   await env.DB.prepare('INSERT OR IGNORE INTO support_requests(id,created_at,email,message,app_user_id,object_key,payload_sha256,payload_bytes) VALUES (?,?,?,?,?,?,?,?)')
    .bind(body.id,Date.now(),body.email,body.message,body.appUserId,objectKey,sha,bytes.byteLength).run();
   const row=await env.DB.prepare('SELECT * FROM support_requests WHERE id=?').bind(body.id).first();
   if(row.payload_sha256!==sha) {await env.DIAGNOSTICS.delete(objectKey);return response({error:'Request identifier already used.'},409);}
   ctx.waitUntil(notify(env,row));
   return response({id:body.id,saved:true},201);
  } catch(error) {console.error('Support request failed',String(error));return response({error:'Unable to save your request. Please retry.'},503);}
 },
 async scheduled(_event,env,ctx) {
  ctx.waitUntil(retryDeletionNotifications(env));
  ctx.waitUntil((async()=>{
   const rows=await env.DB.prepare('SELECT * FROM support_requests WHERE notification_sent_at IS NULL AND notification_attempts<100 ORDER BY created_at LIMIT 20').all();
   for(const row of rows.results) await notify(env,row);
   await env.DB.prepare('DELETE FROM support_rate_limits WHERE expires_at<?').bind(Date.now()).run();
  })());
 }
};
