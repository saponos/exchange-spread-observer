import { promisify } from 'node:util';

import { logger } from './logger';

/**
 * Creates an async error handler that logs errors
 * Uses promisify to convert callback-style logging to promise-based
 */
export function createErrorHandler(message: string): (error: unknown) => Promise<void> {
  // eslint-disable-next-line promise/prefer-await-to-callbacks -- Required for promisify
  const logErrorCallback = (error: unknown, callback: (err: Error | null) => void): void => {
    try {
      logger.error(message, error);
      // eslint-disable-next-line promise/prefer-await-to-callbacks -- Required for promisify
      callback(null);
    } catch (error_) {
      // eslint-disable-next-line promise/prefer-await-to-callbacks -- Required for promisify
      callback(error_ instanceof Error ? error_ : new Error(String(error_)));
    }
  };
  // eslint-disable-next-line promise/prefer-await-to-callbacks -- Required for promisify
  const promisifiedLogError = promisify(logErrorCallback);

  return async (error: unknown): Promise<void> => {
    await promisifiedLogError(error);
  };
}
