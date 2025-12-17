import { SYMBOL } from '../lib/const';
import { Channel, ChannelToPublish, ChannelToSubscribe } from '../lib/interfaces';
import { processWebSocketOrderBookUpdate } from '../services/orderBook/orderBook.service';

const tickerChannelToSubscribe: ChannelToSubscribe = {
  method: 'sub.ticker',
  param: { symbol: SYMBOL },
  gzip: false,
};

const tickerChannelToPublish: ChannelToPublish = {
  channel: 'push.ticker',
  handler: processWebSocketOrderBookUpdate,
};

export const channels: Channel[] = [
  { channelToSubscribe: tickerChannelToSubscribe, channelToPublish: tickerChannelToPublish },
];
