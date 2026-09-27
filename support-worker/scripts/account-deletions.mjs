#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Operator-only tool, using the operator's existing Cloudflare credentials.
// This records completed work; it never deletes a vendor account or sends mail.
const [action, ...args] = process.argv.slice(2);
const remote = args.includes('--remote'), local = args.includes('--local');
function fail(message) { console.error(message); process.exit(1); }
if (remote === local) fail('Choose exactly one of --remote or --local.');
function query(sql) {
 const result = spawnSync('wrangler', ['d1','execute','linkpower-support', remote ? '--remote' : '--local', '--json','--command',sql],
  {cwd:fileURLToPath(new URL('../',import.meta.url)),encoding:'utf8',maxBuffer:2*1024*1024,
   // D1 commands in some Wrangler versions ignore account_id in the config.
   env:{...process.env,CLOUDFLARE_ACCOUNT_ID:'f0b125eb8ba8735c5e1c633fc79b2fa9'}});
 if (result.error || result.status !== 0) fail(result.stderr || result.error?.message || 'Database operation failed.');
 const statements = JSON.parse(result.stdout);
 if (statements.some(result => !result.success)) fail('Database operation failed.');
 return statements.flatMap(result=>result.results ?? []);
}
if (action === 'list') {
 console.table(query(`SELECT id,email,created_at,due_at,notification_sent_at,notification_attempts,notification_error
  FROM account_deletion_requests WHERE status='scheduled' ORDER BY due_at`).map(row => ({...row,
   created_at:new Date(row.created_at).toISOString(),due_at:new Date(row.due_at).toISOString(),
   notification_sent_at:row.notification_sent_at ? new Date(row.notification_sent_at).toISOString() : 'not sent'})));
} else if (action === 'complete') {
 const id = args.find(arg=>!arg.startsWith('--'));
 if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) fail('Provide a valid deletion receipt ID.');
 for (const flag of ['--account-removed','--data-removed','--customer-notified']) {
  if (!args.includes(flag)) fail(`Only complete a request after finishing the work. Missing attestation: ${flag}`);
 }
 const row = query(`SELECT status,linked_providers FROM account_deletion_requests WHERE id='${id}'`)[0];
 if (!row) fail('Request not found.');
 if (row.status === 'completed') { console.log('Already recorded as completed.'); process.exit(0); }
 if (/apple/i.test(row.linked_providers) && !args.includes('--apple-revoked')) fail('This account has a linked Apple identity. Revoke its Sign in with Apple tokens, then include --apple-revoked.');
 const now = Date.now();
 const updated = query(`UPDATE account_deletion_requests SET status='completed',completed_at=${now},customer_notified_at=${now}
  WHERE id='${id}' AND status='scheduled' RETURNING id,status,completed_at`);
 console.log(JSON.stringify(updated,null,2));
} else {
 fail('Usage: node scripts/account-deletions.mjs list --remote | complete <receipt-id> --remote --account-removed --data-removed --customer-notified [--apple-revoked]');
}
