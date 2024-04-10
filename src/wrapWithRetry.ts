import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { AuthenticationLinearError, RatelimitedLinearError } from '@linear/sdk';

export const API_ENDPOINT = 'https://api.linear.app/graphql';
export const DEFAULT_RATE_LIMIT_SLEEP_TIME = 5000;

export const wrapWithRetry = <F extends () => Promise<any>>({
  fetchFunction,
  maxRetries = 3,
  logger,
}: {
  fetchFunction: F;
  maxRetries?: number;
  logger: IntegrationLogger;
}): F => {
  const wrappedFunction = async () => {
    let retryCounter = 0;

    do {
      try {
        const response = await fetchFunction();
        return response;
      } catch (error) {
        if (error instanceof RatelimitedLinearError) {
          const timeToReset = getTimeToResetInMs(
            error.raw?.response?.headers?.['x-ratelimit-requests-reset'],
          );

          logger.info(
            `Encountered a rate limit.  Retrying in ${
              timeToReset / 1000
            } seconds.`,
          );

          retryCounter++;

          await new Promise((resolve) => setTimeout(resolve, timeToReset));
        } else if (error instanceof AuthenticationLinearError) {
          throw new IntegrationProviderAuthenticationError({
            status: error.raw?.response?.status as number,
            statusText: error.type as string,
            endpoint: API_ENDPOINT,
          });
        } else {
          logger.info('Error when trying to fetch resource', {
            error,
          });

          throw new IntegrationProviderAPIError({
            status: error.raw?.response?.status as number,
            statusText: error.type as string,
            endpoint: API_ENDPOINT,
          });
        }
      }
    } while (retryCounter < maxRetries);
  };
  return wrappedFunction as F;
};

export const getTimeToResetInMs = (resetTime: string) => {
  if (!resetTime) return DEFAULT_RATE_LIMIT_SLEEP_TIME;
  // https://developers.linear.app/docs/graphql/working-with-the-graphql-api/rate-limiting#api-request-limits
  return parseInt(resetTime) - new Date().getTime();
};
