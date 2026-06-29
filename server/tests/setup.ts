import bcrypt from 'bcryptjs';

// Provide a deterministic test environment BEFORE any app module (and thus
// the env validator) is imported. dotenv won't override these.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-test-secret-0123456789';
process.env.ADMIN_USERNAME = 'admin';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('password123', 4);
process.env.GMAIL_USER = '';
process.env.GMAIL_APP_PASSWORD = '';
process.env.ADMIN_NOTIFICATION_EMAIL = '';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

export const TEST_USER = 'admin';
export const TEST_PASSWORD = 'password123';
