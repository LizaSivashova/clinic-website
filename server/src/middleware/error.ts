import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { isProd } from '../config/env';

/** 404 handler for unmatched API routes. */
export function notFound(_req: Request, res: Response) {
  res.status(404).json({ ok: false, error: 'הנתיב לא נמצא', code: 'not_found' });
}

/** Central error handler — the single place errors become JSON responses. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      error: err.message,
      code: err.code,
      ...(err.details ? { errors: err.details } : {}),
    });
  }

  logger.error({ err }, 'unhandled error');
  res.status(500).json({
    ok: false,
    error: isProd ? 'שגיאת שרת, נסו שוב מאוחר יותר' : String((err as Error)?.message ?? err),
    code: 'internal',
  });
}
