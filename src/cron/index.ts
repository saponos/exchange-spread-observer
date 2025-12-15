import cron from 'node-cron';
import { getAverageSpread, getOrderBookDepth } from '../core/orderBook/orderBook.service';

cron.schedule('* * * * *', async () => {
  await getOrderBookDepth();
  await getAverageSpread();
});
