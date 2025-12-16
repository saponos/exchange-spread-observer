import { createClient } from 'redis';
import { logger } from '../core/logger';

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

export const redisClient = createClient({ url: redisUrl });

redisClient.on('ready', () => logger.info(`Redis client connected to ${redisUrl}`));

export async function initRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}