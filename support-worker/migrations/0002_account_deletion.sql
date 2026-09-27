CREATE TABLE account_deletion_requests (
 id TEXT PRIMARY KEY,
 account_sub TEXT NOT NULL UNIQUE,
 account_username TEXT NOT NULL,
 email TEXT NOT NULL,
 email_verified INTEGER NOT NULL,
 linked_providers TEXT NOT NULL,
 app_user_id TEXT,
 created_at INTEGER NOT NULL,
 due_at INTEGER NOT NULL,
 processing_days INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled','completed')),
 completed_at INTEGER,
 customer_notified_at INTEGER,
 notification_sent_at INTEGER,
 notification_attempts INTEGER NOT NULL DEFAULT 0,
 notification_error TEXT,
 notification_claimed_at INTEGER,
 notification_next_attempt_at INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX account_deletion_notification_pending ON account_deletion_requests(status, notification_sent_at, notification_next_attempt_at);
