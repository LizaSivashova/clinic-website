import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Validate `req.body` against a Zod schema. On success the parsed/typed value
 * replaces req.body; on failure a 400 with field errors is thrown.
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message);
      return next(AppError.badRequest('קלט לא תקין', errors));
    }
    req.body = result.data;
    next();
  };
}
