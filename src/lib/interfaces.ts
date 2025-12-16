import { OrderBookDepthLevel } from "./types";

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

