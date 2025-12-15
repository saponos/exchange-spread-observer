import { BestPricesDto, OrderBookDepthData } from '../../lib/interfaces';

export async function bestPricesBto(orderBookDepth: OrderBookDepthData): Promise<BestPricesDto> {
  const bestBid = orderBookDepth.bids.shift();
  const bestAsk = orderBookDepth.asks.shift();
  const bestBidPrice = Number(bestBid?.shift() ?? 0);
  const bestAskPrice = Number(bestAsk?.shift() ?? 0);

  const bestPricesDto: BestPricesDto = {
    bid: bestBidPrice,
    ask: bestAskPrice,
    timestamp: orderBookDepth.timestamp,
  };

  return bestPricesDto;
}
