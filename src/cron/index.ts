import { schedule } from 'node-cron';

import { getAverageSpread, getOrderBookDepth } from '../services/orderBook/orderBook.service';

schedule('* * * * *', async () => {
  await getOrderBookDepth();
});

schedule('1 * * * * *', async () => {
  await getAverageSpread();
});
