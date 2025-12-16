import { OrderBookDepthLevel } from './types';

export interface Channel {
  method: string;
  param: Record<string, unknown>;
  gzip?: boolean;
}

export interface OrderBookDepthData {
  asks: OrderBookDepthLevel[];
  bids: OrderBookDepthLevel[];
  version: number;
  timestamp: number;
}

export interface OrderBookDepthResponse {
  success: boolean;
  code: number;
  data: OrderBookDepthData;
}

export interface BestPricesDto {
  bid: number;
  ask: number;
  timestamp: number;
}

export interface OrderBookMetricsDto {
  midPrice: number;
  spread: number;
}

export interface ProcessWebSocketOrderBookUpdateResult extends OrderBookMetricsDto {
  lastPrice: number;
}

export interface TickerMessage {
  symbol: string;
  data: TickerData;
  channel: string;
  ts: number;
}

export interface TickerData {
  symbol: string;
  lastPrice: number;
  riseFallRate: number;
  fairPrice: number;
  indexPrice: number;
  volume24: number;
  amount24: number;
  maxBidPrice: number;
  minAskPrice: number;
  lower24Price: number;
  high24Price: number;
  timestamp: number;
  bid1: number;
  ask1: number;
  holdVol: number;
  riseFallValue: number;
  fundingRate: number;
  zone: string;
  riseFallRates: number[];
  riseFallRatesOfTimezone: number[];
}
