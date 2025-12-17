import { logger } from '../core/logger';

/**
 * Creates an async error handler that logs errors
 * Returns a promise-based function for error handling
 */
export function createErrorHandler(message: string): (error: unknown) => Promise<void> {
  return (error: unknown): Promise<void> => {
    try {
      logger.error(message, error);
      return Promise.resolve();
    } catch (error_) {
      return Promise.reject(error_ instanceof Error ? error_ : new Error(String(error_)));
    }
  };
}
