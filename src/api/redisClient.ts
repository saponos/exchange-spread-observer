import { createClient } from 'redis';

import { logger } from '../core/logger';

const redisUrl =
  process.env.REDIS_URL ??
  (process.env.REDIS_HOST && process.env.REDIS_PORT
    ? `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    : 'redis://localhost:6379');

export const redisClient = createClient({ url: redisUrl });

redisClient.on('ready', () => logger.info(`Connected to Redis at ${redisUrl}`));

export async function initRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
