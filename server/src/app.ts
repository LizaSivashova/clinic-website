import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import { env, isProd, isTest } from './config/env';
import { logger } from './utils/logger';
import { apiRouter } from './routes';
import { notFound, errorHandler } from './middleware/error';

const here = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(here, '../../client/dist');

/** Build the Express app (no listening) — also used directly by tests. */
export function createApp(): Express {
  const app = express();

  app.set('trust proxy', 1);

  // ---- Security & platform middleware ----
  app.use(
    helmet({
      // Allow the SPA + Google Fonts to load; tune as needed.
      contentSecurityPolicy: isProd ? undefined : false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '64kb' }));
  app.use(cookieParser());
  if (!isTest) app.use(pinoHttp({ logger }));

  // ---- API ----
  app.use('/api', apiRouter);

  // ---- Serve the built SPA in production ----
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (_req, res, next) => {
    res.sendFile(path.join(clientDist, 'index.html'), (err) => {
      if (err) next();
    });
  });

  // ---- Errors ----
  app.use('/api', notFound);
  app.use(errorHandler);

  return app;
}
