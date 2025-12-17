// eslint-disable-next-line import/no-named-as-default
import WebSocket, { type WebSocket as WebSocketType } from 'ws';

import { logger } from '../core/logger';
import { channels } from '../core/ws.channels';
import { EXCHANGE_NAME, PING_INTERVAL, PONG_TIMEOUT, WS_URL } from '../lib/const';
import { TickerMessage } from '../lib/interfaces';

type MessageHandler = (data: unknown) => unknown;

let wsClient: WebSocketType | null = null;
let pingInterval: NodeJS.Timeout | null = null;
let pongTimeout: NodeJS.Timeout | null = null;
let isAlive = false;
const channelHandlers: { channel: string; handler: MessageHandler }[] = [];

function clearTimers(): void {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
  if (pongTimeout) {
    clearTimeout(pongTimeout);
    pongTimeout = null;
  }
}

function startPingPong(): void {
  isAlive = true;

  pingInterval = setInterval(() => {
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
      wsClient.send(JSON.stringify({ method: 'ping' }));
    }
  }, PING_INTERVAL);

  pongTimeout = setTimeout(() => {
    if (!isAlive && wsClient) {
      wsClient.terminate();
    }
  }, PONG_TIMEOUT);
}

export async function initWebSocket(): Promise<void> {
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    return;
  }

  return new Promise((resolve, reject) => {
    wsClient = new WebSocket(WS_URL);

    wsClient.on('open', () => {
      logger.info(`Connected to ${EXCHANGE_NAME} WebSocket at ${WS_URL}`);
      startPingPong();
      subscribeTo();
      resolve();
    });

    wsClient.on('message', (data: WebSocket.RawData) => {
      try {
        let message: string;
        if (typeof data === 'string') {
          message = data;
        } else if (Buffer.isBuffer(data)) {
          message = data.toString('utf8');
        } else if (data instanceof ArrayBuffer) {
          message = Buffer.from(data).toString('utf8');
        } else {
          throw new TypeError('Unsupported WebSocket message format');
        }
        const parsed = JSON.parse(message) as TickerMessage;
        if (parsed.channel === 'pong') {
          isAlive = true;
          if (pongTimeout) {
            clearTimeout(pongTimeout);
          }
          pongTimeout = setTimeout(() => {
            if (!isAlive && wsClient) {
              logger.warn('WebSocket pong timeout - terminating connection');
              wsClient.terminate();
            }
          }, PONG_TIMEOUT);
          return;
        }

        channelHandlers.forEach((handler) => {
          try {
            if (handler.channel === parsed.channel) {
              handler.handler(parsed);
            }
          } catch (error) {
            logger.error('Error in message handler', error);
          }
        });
      } catch (error) {
        logger.error('Error processing WebSocket message', error);
      }
    });

    wsClient.on('error', (error: Error) => {
      logger.error('WebSocket error', error);
      clearTimers();
      reject(error);
    });

    wsClient.on('close', (code: number, reason: Buffer) => {
      logger.warn('WebSocket closed', { code, reason: reason.toString() });
      clearTimers();
      wsClient = null;
    });
  });
}

export function subscribeTo(): void {
  if (!wsClient || wsClient.readyState !== WebSocket.OPEN) {
    logger.error('WebSocket is not connected. Cannot subscribe.');
    return;
  }

  for (const channel of channels) {
    wsClient.send(JSON.stringify(channel.channelToSubscribe));
    channelHandlers.push(channel.channelToPublish);
  }
}
