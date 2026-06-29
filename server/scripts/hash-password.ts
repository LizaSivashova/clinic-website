#!/usr/bin/env tsx
/**
 * Generate a bcrypt hash for the admin password.
 *
 *   npm --prefix server run hash-password -- "my-super-secret-password"
 *
 * Copy the printed line into .env as ADMIN_PASSWORD_HASH.
 */
import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password) {
  console.error('\n  Usage: npm run hash-password -- "your-password"\n');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log('\nCopy this line into .env:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
