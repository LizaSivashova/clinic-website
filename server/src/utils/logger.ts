import { pino } from 'pino';
import { env, isProd } from '../config/env';

// Structured JSON logs in production; pretty, colourised logs in development.
export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : isProd ? 'info' : 'debug',
  transport: isProd
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname' },
      },
});
