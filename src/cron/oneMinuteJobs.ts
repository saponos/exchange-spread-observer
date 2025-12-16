import { decorateFunction, HandleErrors } from '../core/decorators';
import { getAverageSpread, getOrderBookDepth } from '../core/orderBook/orderBook.service';
import { logger } from '../core/logger';

export const cronJobsOnEveryMinute = decorateFunction(async (): Promise<void> => {
  await getOrderBookDepth();
  await getAverageSpread();
}, [
  HandleErrors((error) => {
    logger.error('Error in cronJobsOnEveryMinute', error);
  }),
]);
