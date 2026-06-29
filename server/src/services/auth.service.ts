import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import type { LoginInput } from '../schemas';

export type Role = 'admin';
export interface AccessClaims {
  sub: string;
  role: Role;
}

const ACCESS_TTL_SEC = 15 * 60; // 15 minutes
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

const insertRefresh = db.prepare(
  `INSERT INTO refresh_tokens (token_hash, subject, expires_at) VALUES (?, ?, ?)`,
);
const findRefresh = db.prepare(
  `SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked = 0`,
);
const revokeRefresh = db.prepare(`UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?`);
const revokeAllForSubject = db.prepare(`UPDATE refresh_tokens SET revoked = 1 WHERE subject = ?`);

interface RefreshRow {
  id: number;
  token_hash: string;
  subject: string;
  expires_at: string;
  revoked: number;
}

function signAccessToken(subject: string): string {
  const claims: AccessClaims = { sub: subject, role: 'admin' };
  return jwt.sign(claims, env.JWT_SECRET, { expiresIn: ACCESS_TTL_SEC });
}

function issueRefreshToken(subject: string): string {
  const raw = crypto.randomBytes(48).toString('base64url');
  const expires = new Date(Date.now() + REFRESH_TTL_MS).toISOString();
  insertRefresh.run(sha256(raw), subject, expires);
  return raw;
}

export const authService = {
  accessTtlSec: ACCESS_TTL_SEC,
  refreshTtlMs: REFRESH_TTL_MS,

  /** Verify credentials and mint a fresh token pair. */
  login({ username, password }: LoginInput) {
    const userOk = username === env.ADMIN_USERNAME;
    const passOk = userOk && bcrypt.compareSync(password, env.ADMIN_PASSWORD_HASH);
    if (!userOk || !passOk) throw AppError.unauthorized('שם משתמש או סיסמה שגויים');

    return {
      accessToken: signAccessToken(username),
      refreshToken: issueRefreshToken(username),
    };
  },

  /** Rotate a refresh token: revoke the presented one, issue a new pair. */
  rotate(rawRefresh: string) {
    const row = findRefresh.get(sha256(rawRefresh)) as RefreshRow | undefined;
    if (!row) throw AppError.unauthorized('הרשאה לא תקפה');
    if (new Date(row.expires_at).getTime() < Date.now()) {
      revokeRefresh.run(row.token_hash);
      throw AppError.unauthorized('פג תוקף ההתחברות');
    }
    revokeRefresh.run(row.token_hash); // single-use rotation
    return {
      accessToken: signAccessToken(row.subject),
      refreshToken: issueRefreshToken(row.subject),
    };
  },

  /** Revoke a single refresh token (logout). */
  revoke(rawRefresh: string | undefined) {
    if (rawRefresh) revokeRefresh.run(sha256(rawRefresh));
  },

  revokeAll(subject: string) {
    revokeAllForSubject.run(subject);
  },

  verifyAccessToken(token: string): AccessClaims {
    try {
      return jwt.verify(token, env.JWT_SECRET) as AccessClaims;
    } catch {
      throw AppError.unauthorized('הרשאה לא תקפה');
    }
  },
};
