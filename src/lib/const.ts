export const SYMBOL = process.env.EXCHANGE_SYMBOL ?? 'BTC_USDT';
export const KEY = `exchange:spreads:${SYMBOL}`;
export const MAX_SPREADS_COUNT = 10;