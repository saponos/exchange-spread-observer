import { logger } from './core/logger';

async function start(): Promise<void> {
  logger.info('Starting Exchange Spread Observer...');
  // TODO: Initialize API clients and calculator
  // TODO: Connect to WebSocket streams
  // TODO: Start processing data
  logger.info('Exchange Spread Observer started successfully');
}

try {
  await start();
} catch (error) {
  logger.error('Failed to start application', error);
  throw error;
}
