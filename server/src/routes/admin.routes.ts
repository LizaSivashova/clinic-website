import { Router, type CookieOptions, type Response } from 'express';
import { authService } from '../services/auth.service';
import { statsService } from '../services/stats.service';
import { settingsService } from '../services/settings.service';
import { submissionsRepo } from '../db/submissions.repository';
import { validateBody } from '../middleware/validate';
import { requireAuth, requireRole } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';
import { loginSchema, settingsSchema } from '../schemas';
import { isProd } from '../config/env';
import { AppError } from '../utils/AppError';

export const adminRouter = Router();

const REFRESH_COOKIE = 'rt';
const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax',
  path: '/api/admin',
  maxAge: authService.refreshTtlMs,
});

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, cookieOptions());
}

// POST /api/admin/login — verify credentials, set refresh cookie, return access token.
adminRouter.post('/login', authLimiter, validateBody(loginSchema), async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    // `token` kept as an alias for backward compatibility with the client.
    res.json({ ok: true, accessToken, token: accessToken, expiresIn: authService.accessTtlSec });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/refresh — rotate the refresh cookie, return a new access token.
adminRouter.post('/refresh', authLimiter, async (req, res, next) => {
  try {
    const raw = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!raw) throw AppError.unauthorized('אין הרשאת רענון');
    const { accessToken, refreshToken } = authService.rotate(raw);
    setRefreshCookie(res, refreshToken);
    res.json({ ok: true, accessToken, token: accessToken, expiresIn: authService.accessTtlSec });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/logout — revoke the refresh token and clear the cookie.
adminRouter.post('/logout', (req, res) => {
  authService.revoke(req.cookies?.[REFRESH_COOKIE]);
  res.clearCookie(REFRESH_COOKIE, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
});

// ---- Everything below requires an authenticated admin ----
adminRouter.use(requireAuth, requireRole('admin'));

adminRouter.get('/submissions', (_req, res) => {
  res.json({ ok: true, submissions: submissionsRepo.findAll() });
});

adminRouter.get('/stats', (_req, res) => {
  res.json({ ok: true, stats: statsService.compute() });
});

adminRouter.get('/settings', (_req, res) => {
  res.json({ ok: true, settings: settingsService.get() });
});

adminRouter.put('/settings', validateBody(settingsSchema), (req, res) => {
  const { newPasswordHash } = settingsService.update(req.body);
  res.json({ ok: true, newPasswordHash });
});
