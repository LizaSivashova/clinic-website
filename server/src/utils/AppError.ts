/**
 * Operational error with an HTTP status code and an optional machine-readable
 * code. Thrown by services/middleware and translated to a JSON response by the
 * central error handler.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, message: string, code = 'error', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, AppError);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(400, message, 'bad_request', details);
  }
  static unauthorized(message = 'לא מורשה') {
    return new AppError(401, message, 'unauthorized');
  }
  static forbidden(message = 'אין הרשאה') {
    return new AppError(403, message, 'forbidden');
  }
  static tooMany(message = 'יותר מדי בקשות') {
    return new AppError(429, message, 'rate_limited');
  }
  static internal(message = 'שגיאת שרת') {
    return new AppError(500, message, 'internal');
  }
}
