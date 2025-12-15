import { decorateFunction, HandleErrors, LogWith } from '../decorators';
import { logger } from '../logger';
import { getOrderBookDepthImpl, getAverageSpreadImpl } from './implementations';
import { OrderBookMetricsDto } from '../../lib/interfaces';

export const getOrderBookDepth = decorateFunction(getOrderBookDepthImpl, [
  LogWith((result: OrderBookMetricsDto) => {
    logger.info(`REST mid=${result.midPrice} spread=${result.spread}%`);
  }),
  HandleErrors((error) => {
    logger.error('Error in orderBookService', error);
  }),
]);

export const getAverageSpread = decorateFunction(getAverageSpreadImpl, [
  LogWith((result: number) => {
    logger.info(`Average spread=${result}%`);
  }),
  HandleErrors((error) => {
    logger.error('Error in getAverageSpread', error);
  }),
]);