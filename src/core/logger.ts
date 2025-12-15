import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import { createLogger, format, transports, Logform } from 'winston';

type LogMessage = `${string} [${string}]: ${string}${` ${string}` | ''}`;

const logsDir = path.join(process.cwd(), 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

const isDocker =
  process.env.DOCKER === 'true' ||
  process.env.NODE_ENV === 'production' ||
  (process.platform === 'linux' && existsSync('/.dockerenv'));

const consoleFormat = isDocker
  ? format.combine(format.timestamp(), format.errors({ stack: true }), format.json())
  : format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message, ...meta }: Logform.TransformableInfo) => {
        let msg: LogMessage =
          `${timestamp as string} [${level}]: ${message as string}` as LogMessage;
        if (Object.keys(meta).length > 0) {
          msg += ` ${JSON.stringify(meta)}`;
        }
        return msg;
      })
    );

export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: logFormat,
  defaultMeta: { service: 'exchange-spread-observer' },
  transports: [
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
    new transports.Console({
      format: consoleFormat,
    }),
  ],
});
