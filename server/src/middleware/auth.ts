import type { NextFunction, Request, Response } from 'express';
import { authService, type AccessClaims, type Role } from '../services/auth.service';
import { AppError } from '../utils/AppError';

// Augment Express' Request with the authenticated user.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessClaims;
    }
  }
}

/** Require a valid access token (Bearer header). Attaches req.user. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw AppError.unauthorized();
  req.user = authService.verifyAccessToken(token);
  next();
}

/** Require the authenticated user to hold a given role (RBAC). */
export function requireRole(role: Role) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw AppError.unauthorized();
    if (req.user.role !== role) throw AppError.forbidden();
    next();
  };
}
