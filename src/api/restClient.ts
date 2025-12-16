import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { logger } from '../core/logger';
import { OrderBookDepthData, OrderBookDepthResponse } from '../lib/interfaces';
import { decorateFunction, HandleErrors } from '../core/decorators';

let restClientInstance: AxiosInstance | null = null;

export async function getOrderBookDepthBySymbolPair(symbol: string): Promise<OrderBookDepthData> {
  const client = await getRestClient();
  const response = await client.get(
    `/api/v1/contract/depth/${symbol}`
  ) as AxiosResponse<OrderBookDepthResponse>;

  return response.data.data;
}

export const getRestClient = decorateFunction(async (): Promise<AxiosInstance> => {
  if (restClientInstance) {
    return restClientInstance;
  }

  const baseURL = process.env.EXCHANGE_HTTP_BASE_URL;
  if (!baseURL) {
    throw new Error(
      'EXCHANGE_HTTP_BASE_URL environment variable is not set. Please set it in your .env file or docker-compose.yml'
    );
  }

  restClientInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10_000,
  });

  logger.info(`Rest client connected to ${restClientInstance.defaults.baseURL}`);

  return restClientInstance;
}, [
  HandleErrors((error) => {
    logger.error('Error in getRestClient', error);
  }),
]);