import { BestPricesDto, OrderBookDepthData } from '../../lib/interfaces';

export function extractBestPrices(orderBookDepth: OrderBookDepthData): BestPricesDto {
  if (orderBookDepth.bids.length === 0 || orderBookDepth.asks.length === 0) {
    throw new Error('Order book depth is empty - missing bids or asks');
  }

  const bestBid = orderBookDepth.bids[0];
  const bestAsk = orderBookDepth.asks[0];

  const [bestBidPrice, bestAskPrice] = [bestBid[0], bestAsk[0]].map(Number) as [number, number];

  if (bestBidPrice <= 0 || bestAskPrice <= 0) {
    throw new Error('Invalid bid or ask price - must be greater than 0');
  }

  return {
    bid: bestBidPrice,
    ask: bestAskPrice,
    timestamp: orderBookDepth.timestamp,
  };
}
