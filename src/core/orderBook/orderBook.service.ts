import { createErrorHandler } from '../../lib/utils';
import { decorateFunction, HandleErrors, LogWith } from '../decorators';
import { logger } from '../logger';

import {
  getOrderBookDepthImpl,
  getAverageSpreadImpl,
  processWebSocketOrderBookUpdateImpl,
} from './implementations';

export const getOrderBookDepth = decorateFunction(getOrderBookDepthImpl, [
  LogWith((result) => {
    logger.info(`REST mid=${result.midPrice} spread=${result.spread}%`);
  }),
  HandleErrors(createErrorHandler('Error in orderBookService')),
]);

export const getAverageSpread = decorateFunction(getAverageSpreadImpl, [
  LogWith((result: number) => {
    logger.info(`Average spread=${result}%`);
  }),
  HandleErrors(createErrorHandler('Error in getAverageSpread')),
]);

export const processWebSocketOrderBookUpdate = decorateFunction(
  processWebSocketOrderBookUpdateImpl,
  [
    LogWith(({ lastPrice, midPrice, spread }) => {
      logger.info(`WS last=${lastPrice} mid=${midPrice} spread=${spread}%`);
    }),
    HandleErrors(createErrorHandler('Error processing WebSocket orderbook update')),
  ]
);
