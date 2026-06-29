import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env from the project root (one level above /server).
const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../../../.env') });

/**
 * Validate and type the environment up-front. The app refuses to start with a
 * misconfigured environment instead of failing mysteriously at runtime.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),

  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD_HASH: z.string().min(20, 'ADMIN_PASSWORD_HASH must be a bcrypt hash'),

  // Email is optional in dev — the app runs and saves submissions without it.
  GMAIL_USER: z.string().email().optional().or(z.literal('')),
  GMAIL_APP_PASSWORD: z.string().optional().or(z.literal('')),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional().or(z.literal('')),

  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast with a readable message.
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n');
  // eslint-disable-next-line no-console
  console.error(`\nInvalid environment configuration:\n${issues}\n`);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;

export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
