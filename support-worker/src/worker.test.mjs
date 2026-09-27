import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import worker,{downloadToken,validate} from './worker.mjs';
function setup() {
 const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(new URL('../migrations/0001_support.sql',import.meta.url),'utf8'));
 sql.exec(readFileSync(new URL('../migrations/0002_account_deletion.sql',import.meta.url),'utf8'));
 const objects=new Map(), emails=[],pending=[];
 const env={SUPPORT_LINK_KEY:'test-only-key', DB:{prepare(query){let args=[];return {bind(...a){args=a;return this},async first(){return sql.prepare(query).get(...args)||null},async all(){return {results:sql.prepare(query).all(...args)}},async run(){return sql.prepare(query).run(...args)}}}},
 DIAGNOSTICS:{async put(k,v){objects.set(k,v)},async get(k){return objects.has(k)?{body:objects.get(k)}:null},async delete(k){objects.delete(k)}},
 EMAIL:{async send(msg){emails.push(msg)}}};
 return {env,sql,objects,emails,ctx:{waitUntil(p){pending.push(p)}},async flush(){await Promise.all(pending)}};
}
const payload=()=>({id:crypto.randomUUID(),email:'customer@example.com',message:'Cannot connect',appUserId:'exact-user-id',diagnostics:{logs:'all logs',deviceID:'exact-device-id'}});
const request=(body)=>new Request('https://linkpower.app/api/support',{method:'POST',headers:{'content-type':'application/json','CF-Connecting-IP':'192.0.2.1'},body:JSON.stringify(body)});
test('requires valid email, message, appUserId and diagnostics',()=>{
 for(const patch of [{email:'bad'},{email:'a@b.com\r\nBcc:other@x.com'},{message:' '},{appUserId:''},{diagnostics:null}]) assert.ok(validate({...payload(),...patch}));
 assert.equal(validate(payload()),null);
});
test('saves entire payload and exact IDs, emails only owner, idempotent retry',async()=>{
 const s=setup(),p=payload();
 assert.equal((await worker.fetch(request(p),s.env,s.ctx)).status,201);await s.flush();
 const row=s.sql.prepare('SELECT * FROM support_requests').get();assert.equal(row.app_user_id,p.appUserId);
 assert.deepEqual(JSON.parse(new TextDecoder().decode(s.objects.get(row.object_key))),p);
 assert.equal(s.emails.length,1);assert.equal(s.emails[0].to,'brianranglin@gmail.com');assert.equal(s.emails[0].replyTo,p.email);
 assert.equal((await worker.fetch(request(p),s.env,s.ctx)).status,200);await s.flush();assert.equal(s.emails.length,1);
 assert.equal((await worker.fetch(request({...p,message:'changed'}),s.env,s.ctx)).status,409);
});
test('private downloads reject missing, altered and expired tokens',async()=>{
 const s=setup(),p=payload();await worker.fetch(request(p),s.env,s.ctx);await s.flush();
 const expires=Date.now()+60000,token=await downloadToken(s.env,p.id,expires);
 const base=`https://linkpower.app/api/support/${p.id}/diagnostics`;
 for(const suffix of ['',`?expires=${expires}&token=${'0'.repeat(64)}`,`?expires=1&token=${token}`]) assert.equal((await worker.fetch(new Request(base+suffix),s.env,s.ctx)).status,403);
 const good=await worker.fetch(new Request(`${base}?expires=${expires}&token=${token}`),s.env,s.ctx);
 assert.equal(good.status,200);assert.deepEqual(await good.json(),p);assert.match(good.headers.get('Content-Disposition'),/attachment/);
});
test('email failure preserves request and scheduled worker retries',async()=>{
 const s=setup(),p=payload();s.env.EMAIL.send=async()=>{throw new Error('test outage')};
 assert.equal((await worker.fetch(request(p),s.env,s.ctx)).status,201);await s.flush();
 assert.equal(s.sql.prepare('SELECT notification_sent_at FROM support_requests').get().notification_sent_at,null);
 s.env.EMAIL.send=async(msg)=>s.emails.push(msg);await worker.scheduled({},s.env,s.ctx);await s.flush();assert.equal(s.emails.length,1);
 assert.ok(s.sql.prepare('SELECT notification_sent_at FROM support_requests').get().notification_sent_at);
});
test('rate limits repeated submissions and rejects oversized content',async()=>{
 const s=setup();for(let i=0;i<5;i++) assert.equal((await worker.fetch(request(payload()),s.env,s.ctx)).status,201);
 assert.equal((await worker.fetch(request(payload()),s.env,s.ctx)).status,429);await s.flush();
 const x=setup(),req=request(payload());req.headers.set('Content-Length',String(26*1024*1024));assert.equal((await worker.fetch(req,x.env,x.ctx)).status,413);
});
test('storage failure cannot report success or notify',async()=>{
 const s=setup();s.env.DIAGNOSTICS.put=async()=>{throw new Error('test storage unavailable')};
 assert.equal((await worker.fetch(request(payload()),s.env,s.ctx)).status,503);assert.equal(s.emails.length,0);assert.equal(s.sql.prepare('SELECT count(*) AS n FROM support_requests').get().n,0);
});
