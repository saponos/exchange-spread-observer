import 'dotenv/config';
import './cron';
import { initRedis } from './api/redisClient';
import { getRestClient } from './api/restClient';
import { initWebSocket } from './api/wsClient';
import { logger } from './core/logger';

async function main(): Promise<void> {
  logger.info('Starting Exchange Spread Observer...');
  await initRedis();
  await getRestClient();
  await initWebSocket();
}

try {
  await main();
} catch (error) {
  logger.error('Failed to start application', error);
  throw error;
}
