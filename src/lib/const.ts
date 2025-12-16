export const SYMBOL = process.env.EXCHANGE_SYMBOL ?? 'BTC_USDT';
export const KEY = `exchange:spreads:${SYMBOL}`;
export const MAX_SPREADS_COUNT = 10;
export const WS_URL = process.env.EXCHANGE_WS_URL ?? 'wss://contract.mexc.com/edge';
export const PING_INTERVAL = 20_000;
export const PONG_TIMEOUT = 60_000;
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME ?? 'MEXC';
