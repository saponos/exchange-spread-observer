import 'dotenv/config';
import './cron';
import { initRedis } from './api/redisClient';
import { getRestClient } from './api/restClient';
import { initWebSocket, subscribeTo } from './api/wsClient';
import { logger } from './core/logger';
import { processWebSocketOrderBookUpdate } from './core/orderBook/orderBook.service';
import { SYMBOL } from './lib/const';
import { Channel } from './lib/interfaces';

async function main(): Promise<void> {
  logger.info('Starting Exchange Spread Observer...');
  await initRedis();
  await getRestClient();
  await initWebSocket();

  const tickerChannel: Channel = {
    method: 'sub.ticker',
    param: { symbol: SYMBOL },
    gzip: false,
  };

  subscribeTo(tickerChannel, { channel: 'push.ticker', handler: processWebSocketOrderBookUpdate });
}

try {
  await main();
} catch (error) {
  logger.error('Failed to start application', error);
  throw error;
}
