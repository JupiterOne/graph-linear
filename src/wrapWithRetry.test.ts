import {
  AuthenticationLinearError,
  LinearError,
  RatelimitedLinearError,
} from '@linear/sdk';
import {
  DEFAULT_RATE_LIMIT_SLEEP_TIME,
  getTimeToResetInMs,
  wrapWithRetry,
} from './wrapWithRetry';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

describe('wrapWithRetry', () => {
  test('retries on a rate limit error', async () => {
    const mockFetchFunction = jest.fn(async () => {
      return new Promise((resolve, reject) => {
        reject(
          new RatelimitedLinearError({
            response: {
              headers: {
                'X-RateLimit-Requests-Reset': Math.round(
                  new Date().getTime() + 1000,
                ).toString(),
              } as any,
            },
          }),
        );
      });
    });

    await wrapWithRetry({
      fetchFunction: mockFetchFunction,
      logger: { info: jest.fn() } as any,
    })();

    expect(mockFetchFunction).toHaveBeenCalledTimes(3);
  });

  test('throws on an authentication error', async () => {
    const mockFetchFunction = jest.fn(async () => {
      return new Promise((resolve, reject) => {
        reject(new AuthenticationLinearError());
      });
    });

    await expect(
      wrapWithRetry({
        fetchFunction: mockFetchFunction,
        logger: { info: jest.fn() } as any,
      })(),
    ).rejects.toThrow(IntegrationProviderAuthenticationError);
  });

  test('throws on an uncategorized error', async () => {
    const mockFetchFunction = jest.fn(async () => {
      return new Promise((resolve, reject) => {
        reject(new LinearError());
      });
    });

    await expect(
      wrapWithRetry({
        fetchFunction: mockFetchFunction,
        logger: { info: jest.fn() } as any,
      })(),
    ).rejects.toThrow(IntegrationProviderAPIError);
  });

  test('does not retry if the request was successful', async () => {
    const mockFetchFunction = jest.fn(async () => {
      return new Promise((resolve, reject) => {
        resolve('hi');
      });
    });

    const result = await wrapWithRetry({
      fetchFunction: mockFetchFunction,
      logger: { info: jest.fn() } as any,
    })();

    expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    expect(result).toBe('hi');
  });
});

describe('getTimeToResetInMs', () => {
  test('returns the time to reset in milliseconds', () => {
    const mockReturnedResetTime = (
      Math.round(new Date().getTime() / 1000) + 60
    ).toString();

    // the range here is to account for the time it takes to run the test
    expect(getTimeToResetInMs(mockReturnedResetTime)).toBeGreaterThanOrEqual(
      59000,
    );
    expect(getTimeToResetInMs(mockReturnedResetTime)).toBeLessThanOrEqual(
      61000,
    );
  });

  test('returns default if no time is passed in', () => {
    const mockReturnedResetTime = undefined as any;

    expect(getTimeToResetInMs(mockReturnedResetTime)).toBe(
      DEFAULT_RATE_LIMIT_SLEEP_TIME,
    );
  });
});
