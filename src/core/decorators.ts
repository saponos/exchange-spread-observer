import { logger } from '../core/logger';

export type FunctionDecorator<TArgs extends unknown[], TReturn> = (
  fn: (...args: TArgs) => Promise<TReturn>
) => (...args: TArgs) => Promise<TReturn>;

export function decorateFunction<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  decorators: Array<FunctionDecorator<TArgs, TReturn>>
): (...args: TArgs) => Promise<TReturn> {
  return decorators.reduce((wrappedFn, decorator) => decorator(wrappedFn), fn);
}

export function HandleErrors(errorHandler?: (error: unknown) => void) {
  return <TArgs extends unknown[], TReturn>(
    fn: (...args: TArgs) => Promise<TReturn>
  ): ((...args: TArgs) => Promise<TReturn>) => {
    const functionName = fn.name || 'anonymous';

    return async (...args: TArgs): Promise<TReturn> => {
      try {
        return await fn(...args);
      } catch (error) {
        if (errorHandler) {
          errorHandler(error);
        } else {
          logger.error(`[${functionName}] Error:`, error);
        }
        throw error;
      }
    };
  };
}

export function LogWith<TArgs extends unknown[], TReturn>(
  formatter: (result: TReturn, args: TArgs) => void
) {
  return (fn: (...args: TArgs) => Promise<TReturn>): ((...args: TArgs) => Promise<TReturn>) =>
    async (...args: TArgs): Promise<TReturn> => {
      const result = await fn(...args);
      formatter(result, args);
      return result;
    };
}
