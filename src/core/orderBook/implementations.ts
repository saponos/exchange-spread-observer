import { getOrderBookDepthBySymbolPair } from '../../api/restClient';
import { SYMBOL } from '../../lib/const';
import {
  OrderBookMetricsDto,
  ProcessWebSocketOrderBookUpdateResult,
  TickerMessage,
} from '../../lib/interfaces';
import { SpreadType } from '../../lib/types';
import { getRecentSpreads, saveSpread } from '../../repository/spread.repository';
import { calculateAverageSpread, calculateMidPrice, calculateSpread } from '../calculator';
import { extractBestPrices } from '../dto/bestPrices.dto';

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

export async function processWebSocketOrderBookUpdateImpl(
  data: unknown
): Promise<ProcessWebSocketOrderBookUpdateResult> {
  const message = data as TickerMessage;

  const {
    ts: timestamp,
    data: { ask1, bid1, lastPrice },
  } = message;
  const midPrice = calculateMidPrice(bid1, ask1);
  const spreadPercentage = calculateSpread(midPrice, bid1, ask1);

  await saveSpread(spreadPercentage, timestamp);

  return {
    lastPrice,
    midPrice,
    spread: spreadPercentage,
  };
}
