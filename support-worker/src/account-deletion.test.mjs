import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {generateKeyPair, SignJWT} from 'jose';
import {ACCOUNT_ISSUER, ACCOUNT_CLIENT_ID, handleAccountDeletion, retryDeletionNotifications, verifyAccount, processingDays} from './account-deletion.mjs';
import worker from './worker.mjs';

const keys = await generateKeyPair('RS256');
const accountID = 'a5e9d5de-14c1-435e-ab2d-5ae389142990';
async function token(patch = {}, privateKey = keys.privateKey) {
 const now = Math.floor(Date.now()/1000);
 return new SignJWT({iss: ACCOUNT_ISSUER, aud: ACCOUNT_CLIENT_ID, sub: accountID,
  iat: now, exp: now+600, token_use: 'id', email: 'customer@example.com', email_verified: true,
  'cognito:username': 'Apple_example', identities: [{providerName:'SignInWithApple', userId:'unnecessary-sensitive-id'}], ...patch})
  .setProtectedHeader({alg:'RS256', kid:'test'}).sign(privateKey);
}
function request(jwt, body = undefined) {
 return new Request('https://linkpower.app/api/account-deletion', {method: body === undefined ? 'GET' : 'POST',
  headers: {'Authorization': `Bearer ${jwt}`, 'Content-Type': 'application/json'}, body: body === undefined ? undefined : JSON.stringify(body)});
}
const body = () => ({confirm: true, processingDays: 14, appUserId: 'app-user-reference'});
function setup() {
 const sql = new DatabaseSync(':memory:');
 for (const file of ['0001_support.sql','0002_account_deletion.sql']) sql.exec(readFileSync(new URL(`../migrations/${file}`,import.meta.url),'utf8'));
 const emails = [], pending = [];
 const env = {ACCOUNT_DELETION_WINDOW_DAYS: '14', EMAIL:{async send(message) { emails.push(message); }},
  DB:{prepare(query) {let args=[]; return {bind(...a){args=a;return this;},
   async first(){return sql.prepare(query).get(...args) ?? null;},
   async all(){return {results:sql.prepare(query).all(...args)};},async run(){return sql.prepare(query).run(...args);}};}}};
 const ctx = {waitUntil(promise) {pending.push(promise);}};
 return {sql, env, emails, ctx, async flush(){await Promise.all(pending.splice(0));},
  async call(req){return handleAccountDeletion(req, env, ctx, keys.publicKey);}};
}

test('auth verifies signature, issuer, client, purpose, expiration and identity', async () => {
 assert.equal((await verifyAccount(request(await token()),keys.publicKey)).sub,accountID);
 for (const patch of [{iss:'https://attacker.example'},{aud:'other-client'},{token_use:'access'},
  {exp:1},{exp:undefined},{iat:undefined},{iat:Math.floor(Date.now()/1000)+3600},
  {sub:undefined},{sub:'not-an-account'}, {email:'customer@example.com\r\nBcc:someone@example.com'}, {'cognito:username':undefined}]) {
  const s = setup();
  assert.equal((await s.call(request(await token(patch),body()))).status,401,JSON.stringify(patch));
  assert.equal(s.sql.prepare('SELECT COUNT(*) n FROM account_deletion_requests').get().n,0);
 }
 const wrong = await generateKeyPair('RS256');
 assert.equal((await setup().call(request(await token({},wrong.privateKey),body()))).status,401);
 assert.equal((await worker.fetch(new Request('https://linkpower.app/api/account-deletion'),setup().env,setup().ctx)).status,401);
});

test('persists verified account, returns receipt before mail, and deduplicates across devices', async () => {
 const s = setup(), jwt = await token();
 const untouched = await (await s.call(request(jwt))).json();
 assert.equal(untouched.request,null); assert.equal(untouched.processingDays,14); assert.equal(s.emails.length,0);
 const response = await s.call(request(jwt,{...body(),account_sub:'spoofed',email:'attacker@example.com'}));
 assert.equal(response.status,201);
 const first = await response.json();
 assert.equal(first.accountID,accountID); assert.equal(first.request.status,'scheduled');
 assert.equal(Date.parse(first.request.dueAt)-Date.parse(first.request.createdAt),14*86400000);
 await s.flush();
 const row = s.sql.prepare('SELECT * FROM account_deletion_requests').get();
 assert.equal(row.account_sub,accountID); assert.equal(row.email,'customer@example.com');
 assert.ok(!JSON.stringify(row).includes(jwt)); assert.ok(!JSON.stringify(row).includes('unnecessary-sensitive-id'));
 assert.equal(s.emails.length,1); assert.equal(s.emails[0].to,'brianranglin@gmail.com');
 assert.equal(s.emails[0].replyTo,'customer@example.com'); assert.match(s.emails[0].text,/Manual action is required/);
 assert.match(s.emails[0].text,/SignInWithApple/);
 for (let i=0;i<8;i++) {
  const retry = await s.call(request(jwt,body())); assert.equal(retry.status,200);
  assert.deepEqual((await retry.json()).request,first.request);
 }
 await s.flush(); assert.equal(s.emails.length,1);
 const again = await (await s.call(request(jwt))).json(); assert.deepEqual(again.request,first.request);
});

test('simultaneous submissions produce one request and one owner notification', async () => {
 const s = setup(), jwt = await token();
 const responses = await Promise.all([s.call(request(jwt,body())),s.call(request(jwt,body()))]);
 assert.deepEqual(responses.map(r=>r.status).sort(),[200,201]);
 const receipts = await Promise.all(responses.map(r=>r.json()));
 assert.equal(receipts[0].request.id,receipts[1].request.id);
 await s.flush(); assert.equal(s.emails.length,1);
});

test('status is private to the authenticated account', async () => {
 const s = setup(); await s.call(request(await token(),body())); await s.flush();
 const other = await token({sub:crypto.randomUUID(),email:'other@example.com'});
 const status = await (await s.call(request(other))).json();
 assert.equal(status.request,null); assert.equal(status.accountEmail,'other@example.com');
 assert.ok(!JSON.stringify(status).includes(accountID));
});

test('requires consent and the displayed timeframe, enforces body limits, and fails closed without a timeframe', async () => {
 const s = setup(), jwt = await token();
 for (const data of [{},null,{...body(),confirm:false},{...body(),appUserId:5},{...body(),appUserId:'id\nAnother account: injected'}]) {
  assert.equal((await s.call(request(jwt,data))).status,400);
 }
 assert.equal((await s.call(request(jwt,{...body(),processingDays:30}))).status,409);
 const oversized = request(jwt,{...body(),extra:'a'.repeat(3000)});
 assert.equal((await s.call(oversized)).status,413);
 s.env.ACCOUNT_DELETION_WINDOW_DAYS='';
 assert.equal((await s.call(request(jwt,body()))).status,503);
 assert.equal((await (await s.call(request(jwt))).json()).processingDays,null);
 for (const value of ['',0,'14 days',-1,100,Infinity]) assert.equal(processingDays({ACCOUNT_DELETION_WINDOW_DAYS:value}),null);
 assert.equal(s.sql.prepare('SELECT COUNT(*) n FROM account_deletion_requests').get().n,0);
});

test('mail outage retains receipt and retries without making the customer resubmit', async () => {
 const s = setup(), jwt = await token();
 s.env.EMAIL.send=async()=>{throw new Error('mail failure with private metadata');};
 const saved = await (await s.call(request(jwt,body()))).json(); await s.flush();
 let row=s.sql.prepare('SELECT * FROM account_deletion_requests').get();
 assert.equal(row.id,saved.request.id);assert.equal(row.notification_sent_at,null);
 assert.equal(row.notification_attempts,1); assert.ok(row.notification_next_attempt_at>Date.now());
 assert.ok(!row.notification_error.includes('private metadata'));
 s.env.EMAIL.send=async message=>s.emails.push(message);
 await retryDeletionNotifications(s.env); assert.equal(s.emails.length,0);
 s.sql.prepare('UPDATE account_deletion_requests SET notification_next_attempt_at=0').run();
 await retryDeletionNotifications(s.env); await retryDeletionNotifications(s.env);
 assert.equal(s.emails.length,1);
 row=s.sql.prepare('SELECT * FROM account_deletion_requests').get();
 assert.ok(row.notification_sent_at);assert.equal(row.notification_error,null);
});

test('database failure never reports scheduled or sends a notification', async () => {
 const s=setup(); s.env.DB.prepare=()=>{throw new Error('storage offline');};
 assert.equal((await s.call(request(await token(),body()))).status,503);
 assert.equal(s.emails.length,0);
});

test('completed status cannot enqueue another deletion or email', async () => {
 const s=setup(), jwt=await token(); await s.call(request(jwt,body())); await s.flush();
 s.sql.prepare("UPDATE account_deletion_requests SET status='completed',completed_at=?,customer_notified_at=?").run(Date.now(),Date.now());
 const result=await s.call(request(jwt,body())); await s.flush();
 assert.equal((await result.json()).request.status,'completed');assert.equal(s.emails.length,1);
});
