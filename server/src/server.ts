import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Server listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

// Graceful shutdown
function shutdown(signal: string) {
  logger.info(`${signal} received — shutting down`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  // Force-exit if it hangs.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
