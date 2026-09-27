# LinkPower support

The native Help → Request support form posts to `https://linkpower.app/api/support`.
This Worker intercepts `/api/support*` and `/api/account-deletion*`; the existing Cloudflare Pages site is unchanged.

- D1 `linkpower-support`: contact email, message, exact Superwall user ID, receipt ID, upload metadata, notification delivery state.
- Private R2 `linkpower-support-diagnostics`: complete submitted JSON bundle. No public bucket access.
- Cloudflare Email binding: notifies `brianranglin@gmail.com`, with the customer's email as Reply-To and an HMAC-signed download URL expiring in seven days.
- `SUPPORT_LINK_KEY` is a Worker secret, never shipped to the app. Rotating it invalidates existing links.
- Email failures leave the saved request intact. A ten-minute cron retries unsent messages, up to 100 attempts. Inspect `notification_error` for failures; reset attempts after resolving an outage if needed.
- Receipt IDs are idempotency keys; retrying identical bytes returns the existing receipt. A different payload with the same ID is rejected.
- Upload limit: 25 MiB, enforced during streaming. The app fails visibly if its bundle exceeds that limit; no silent truncation during upload.
- Public intake limits: five attempts/IP/hour and 200/day globally. IP addresses are hashed before storage. Rate-limit entries expire and are cleaned up by cron.
- Signed URLs are private bearer links: anyone with the link can download that request until expiry. They are only emailed to the support recipient. R2 and D1 remain accessible to authorized Cloudflare account administrators after link expiry.

## Diagnostics coverage

The app includes both retained cloud JSONL files (the logger rotates at 1 MB), available current-process app unified logs, saved devices and cloud thing IDs, current battery/BLE/network/port/timer data, Starlink readings, widget snapshot and BLE/cloud caches, selected diagnostic preferences, signed-in account claims (no token), app/OS metadata, and `Superwall.shared.userId`.

No Keychain dump, saved Wi-Fi password, authentication token, unrelated app files, or other apps' data is uploaded. Cloud logs already redact credentials. Unified logs are sanitized again. Log rotation and iOS's process-log access limits mean deleted/older logs cannot be reconstructed. Collection failures appear in the bundle's `collectionWarnings`.

Submitting explicitly sends this bundle; nothing uploads merely by opening Help. The UI explains included data. Requests and bundles are retained until manually deleted for support purposes; there is no automatic deletion policy yet.

## Operations

```sh
npm test
wrangler deploy
wrangler d1 migrations apply linkpower-support --remote
wrangler d1 execute linkpower-support --remote --command 'SELECT id,created_at,email,notification_sent_at,notification_error FROM support_requests ORDER BY created_at DESC LIMIT 20'
```

Retrieve an expired-link bundle through authenticated `wrangler r2 object get` using the row's `object_key`. To honor deletion, delete that R2 object and its D1 row. Do not publish bundles or signed URLs in public issue trackers.

## Account deletion

Settings → Delete account uses `https://linkpower.app/api/account-deletion`.

- `GET` returns the signed-in account's existing request and the configured completion window. It never creates a request or sends email.
- `POST {"confirm":true,"processingDays":N,"appUserId":"…"}` saves a request and queues an email to **brianranglin@gmail.com**. Both methods require `Authorization: Bearer <PeakDo Cognito ID token>`.
- The Worker verifies RS256 signature, expiration, token purpose, pinned issuer, and native app client ID against Cognito's public JWKS using `jose`. The account ID, username, email, and linked provider names come from the verified token. No token, password, device diagnostics, or linked provider user IDs are stored. The optional Superwall ID is a client-supplied reference, never proof of account ownership.
- D1 enforces one request per Cognito account. Retries and requests from a second phone retrieve the original receipt and deadline. Another account cannot read that receipt. No public completion/admin endpoint exists.
- Success means **saved for manual deletion**, not deleted. D1 save failure returns an error. Email failure keeps the receipt, retries with increasing delays up to once daily, and has no silent maximum-attempt cutoff. Check the queue regularly, including `notification_error`, overdue dates, and delivery state.
- The existing email binding only sends to Brian. **Customer completion email must be sent manually** by replying to the notification. It is not automatically sent by this Worker. Delivery retries may produce a duplicate owner email if delivery succeeds but recording that success fails.

### Enable intake

Before enabling, confirm access to a process that can delete the **PeakDo account and its associated data**, not just the local app session. Confirm any required Sign in with Apple token revocation can be performed. Setting a completion window represents an operational promise, not an estimate invented by the app.

`ACCOUNT_DELETION_WINDOW_DAYS` in `wrangler.jsonc` is set to **30 calendar days**, as approved by the owner. Intake is enabled with this setting. The app displays the server's window before confirmation; the deadline is saved with each receipt and does not change when the configuration changes. To change the window, choose an agreed number of days (1–90) and redeploy. Unsetting the value disables new submissions while preserving existing status lookups.

Apply the migration **before** deploying the new Worker:

```sh
npm ci
npm test
export CLOUDFLARE_ACCOUNT_ID=f0b125eb8ba8735c5e1c633fc79b2fa9
wrangler d1 migrations apply linkpower-support --remote
wrangler deploy
```

No additional secrets or email recipients are required. Deploying code does not remove any accounts. Do not submit a real test deletion request unless the account owner actually wants deletion.

### Process a request

```sh
node scripts/account-deletions.mjs list --remote
```

1. Use the verified Cognito account sub and username in the owner notification to identify the correct PeakDo account. Remove the account and associated cloud data through the authorized vendor/admin process. Remove relevant LinkPower-held support/diagnostic records, and handle any justified retention under the privacy policy. Match records carefully; do not act on the client-supplied Superwall ID alone.
2. If an Apple identity is linked, revoke Sign in with Apple tokens as part of deletion. Resolve any other identity-provider obligations through the vendor. This API cannot do that on its own.
3. Email the customer at the request's contact address to confirm completion. Suggested wording: “Your PeakDo account and associated data have been deleted. Your deletion receipt is [receipt]. This does not cancel App Store subscriptions; manage them at https://apps.apple.com/account/subscriptions.” Only say this after completing the work; explain any required retained records accurately.
4. Record completion (the flags attest that the manual work and email are already done):

```sh
node scripts/account-deletions.mjs complete <receipt-id> --remote --account-removed --data-removed --customer-notified
# Add --apple-revoked when the account has a linked Apple identity.
```

Completion suppresses further request notifications. The record includes `completed_at` and `customer_notified_at`. Completion records are retained until manually removed; review and purge personal data when no longer needed. The customer may be unable to authenticate after the account is removed, so email—not a later in-app sign-in—is the completion confirmation.

Apple permits manual processing when the app initiates deletion, discloses the timeframe, and confirms completion: https://developer.apple.com/support/offering-account-deletion-in-your-app/ . A request queue alone does not fulfill account deletion.
