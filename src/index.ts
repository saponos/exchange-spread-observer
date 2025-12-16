import 'dotenv/config';
import './cron';
import { initRedis } from './api/redisClient';
import { getRestClient } from './api/restClient';
import { logger } from './core/logger';
import { getOrderBookDepth } from './core/orderBook/orderBook.service';

async function main(): Promise<void> {
  logger.info('Starting Exchange Spread Observer...');
  
  // Initialize API clients
  await initRedis();
  getRestClient();
  
  // TODO: Connect to WebSocket streams
  // TODO: Start processing data
  getOrderBookDepth();
  logger.info('Exchange Spread Observer started successfully');
}

try {
  await main();
} catch (error) {
  logger.error('Failed to start application', error);
  throw error;
}
