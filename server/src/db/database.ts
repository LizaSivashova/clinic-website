import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { isTest } from '../config/env';

const here = path.dirname(fileURLToPath(import.meta.url));

// DB_PATH env var lets production deployments point to a persistent volume.
// Tests always use in-memory for isolation.
const dbPath = isTest
  ? ':memory:'
  : (process.env.DB_PATH ?? path.join(here, 'app.sqlite'));

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/** Idempotent schema migration — safe to run on every boot. */
export function migrate(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      phone      TEXT    NOT NULL,
      email      TEXT    NOT NULL,
      topic      TEXT    NOT NULL,
      message    TEXT    NOT NULL,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions (created_at);
    CREATE INDEX IF NOT EXISTS idx_submissions_topic      ON submissions (topic);

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      token_hash TEXT    NOT NULL UNIQUE,
      subject    TEXT    NOT NULL,
      expires_at TEXT    NOT NULL,
      revoked    INTEGER NOT NULL DEFAULT 0,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_refresh_token_hash ON refresh_tokens (token_hash);
  `);
}

migrate();
