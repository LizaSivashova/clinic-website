import bcrypt from 'bcryptjs';
import { settingsRepo } from '../db/settings.repository';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import type { SettingsInput } from '../schemas';

export const settingsService = {
  get() {
    return {
      notification_email: settingsRepo.get('notification_email') ?? '',
      email_notifications_enabled: settingsRepo.get('email_notifications_enabled') === 'true',
    };
  },

  update(input: SettingsInput): { newPasswordHash: string | null } {
    if (typeof input.notification_email === 'string') {
      settingsRepo.set('notification_email', input.notification_email.trim());
    }
    if (typeof input.email_notifications_enabled === 'boolean') {
      settingsRepo.set('email_notifications_enabled', input.email_notifications_enabled ? 'true' : 'false');
    }

    let newPasswordHash: string | null = null;
    if (input.new_password) {
      const ok = input.current_password && bcrypt.compareSync(input.current_password, env.ADMIN_PASSWORD_HASH);
      if (!ok) throw AppError.unauthorized('הסיסמה הנוכחית שגויה');
      // The hash lives in .env (not the DB), so we return it for the operator
      // to persist, mirroring the original design.
      newPasswordHash = bcrypt.hashSync(input.new_password, 12);
    }

    return { newPasswordHash };
  },
};
