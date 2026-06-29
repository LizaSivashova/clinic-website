import { db } from './database';
import { env } from '../config/env';

const getStmt = db.prepare('SELECT value FROM settings WHERE key = ?');
const setStmt = db.prepare(
  `INSERT INTO settings (key, value) VALUES (?, ?)
   ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
);

export const settingsRepo = {
  get(key: string): string | null {
    const row = getStmt.get(key) as { value: string } | undefined;
    return row ? row.value : null;
  },

  set(key: string, value: string): void {
    setStmt.run(key, value);
  },
};

// Seed defaults once.
if (settingsRepo.get('notification_email') === null) {
  settingsRepo.set('notification_email', env.ADMIN_NOTIFICATION_EMAIL || '');
}
if (settingsRepo.get('email_notifications_enabled') === null) {
  settingsRepo.set('email_notifications_enabled', 'true');
}
