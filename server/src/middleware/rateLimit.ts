import rateLimit from 'express-rate-limit';
import { isTest } from '../config/env';

const jsonError = (message: string) => ({ ok: false, error: message });

// Generous limit for the public contact form.
export const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isTest ? 1000 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonError('יותר מדי בקשות, נסו שוב בעוד דקה'),
});

// Strict limit on auth endpoints to blunt brute-force attempts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonError('יותר מדי ניסיונות התחברות, נסו שוב מאוחר יותר'),
});
