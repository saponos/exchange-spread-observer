import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

import { decorateFunction, HandleErrors } from '../core/decorators';
import { logger } from '../core/logger';
import { EXCHANGE_NAME } from '../lib/const';
import { type OrderBookDepthData, type OrderBookDepthResponse } from '../lib/interfaces';
import { createErrorHandler } from '../lib/utils';

let restClientInstance: AxiosInstance | null = null;

export async function getOrderBookDepthBySymbolPair(symbol: string): Promise<OrderBookDepthData> {
  const client = await getRestClient();
  const response: AxiosResponse<OrderBookDepthResponse> = await client.get(
    `/api/v1/contract/depth/${symbol}`
  );

  return response.data.data;
}

const getRestClientImpl = (): Promise<AxiosInstance> => {
  if (restClientInstance) {
    return Promise.resolve(restClientInstance);
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

  logger.info(`Connected to ${EXCHANGE_NAME} REST API at ${restClientInstance.defaults.baseURL}`);

  return Promise.resolve(restClientInstance);
};

export const getRestClient = decorateFunction(getRestClientImpl, [
  HandleErrors(createErrorHandler('Error in getRestClient')),
]);
