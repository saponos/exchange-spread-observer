import { calculateAverageSpread, calculateMidPrice, calculateSpread } from '../calculator';
import { getRecentSpreads, saveSpread } from '../../repository/spread.repository';
import { getOrderBookDepthBySymbolPair } from '../../api/restClient';
import { SYMBOL } from '../../lib/const';
import { extractBestPrices } from '../dto/bestPrices.dto';
import { OrderBookMetricsDto } from '../../lib/interfaces';
import { SpreadType } from '../../lib/types';

export async function getAverageSpreadImpl(): Promise<number> {
  const lastMinuteSpreads: SpreadType[] = await getRecentSpreads();
  const spreads: number[] = lastMinuteSpreads.map((v) => v.spread);

  return calculateAverageSpread(spreads);
}

export async function getOrderBookDepthImpl(): Promise<OrderBookMetricsDto> {
  const orderBookDepth = await getOrderBookDepthBySymbolPair(SYMBOL);
  const { bid, ask, timestamp } = extractBestPrices(orderBookDepth);

  const midPrice = calculateMidPrice(bid, ask);
  const spreadPercentage = calculateSpread(midPrice, bid, ask);

  await saveSpread(spreadPercentage, timestamp);

  return { midPrice, spread: spreadPercentage };
}
