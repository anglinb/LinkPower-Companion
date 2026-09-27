CREATE TABLE support_requests (
 id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, email TEXT NOT NULL,
 message TEXT NOT NULL, app_user_id TEXT NOT NULL, object_key TEXT NOT NULL,
 payload_sha256 TEXT NOT NULL, payload_bytes INTEGER NOT NULL,
 notification_sent_at INTEGER, notification_attempts INTEGER NOT NULL DEFAULT 0,
 notification_error TEXT, notification_claimed_at INTEGER
);
CREATE INDEX support_notification_pending ON support_requests(notification_sent_at, notification_attempts);
CREATE TABLE support_rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
