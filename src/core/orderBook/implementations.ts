import { calculateAverageSpread } from '../calculator';
import { getRecentSpreads } from '../../repository/spread.repository';
import { getOrderBookDepthBySymbolPair } from '../../api/restClient';
import { SYMBOL } from '../../lib/const';
import { calculateMidPrice } from '../calculator';
import { calculateSpread } from '../calculator';
import { saveSpread } from '../../repository/spread.repository';
import { bestPricesBto } from '../dto/bestPrices.dto';
import { OrderBookMetricsDto } from '../../lib/interfaces';

export async function getAverageSpreadImpl(): Promise<number> {
  const lastMinuteSpreads = await getRecentSpreads();

  return calculateAverageSpread(lastMinuteSpreads.map((v) => v.spread));
}

export async function getOrderBookDepthImpl(): Promise<OrderBookMetricsDto> {
  const orderBookDepth = await getOrderBookDepthBySymbolPair(SYMBOL);
  const { bid, ask, timestamp } = await bestPricesBto(orderBookDepth);

  const midPrice = calculateMidPrice(bid, ask);
  const spread = calculateSpread(midPrice, bid, ask);

  await saveSpread(spread, timestamp);

  return { midPrice, spread };
}
