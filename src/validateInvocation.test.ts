import {
  Recording,
  createMockExecutionContext,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig, validateInvocation } from './config';
import { IntegrationValidationError } from '@jupiterone/integration-sdk-core';
import { setupProjectRecording } from '../test/recording';
import { integrationConfig } from '../test/config';
import { API_ENDPOINT } from './wrapWithRetry';

describe('#validateInvocation', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('requires valid config', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {} as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      IntegrationValidationError,
    );
  });

  test('successfully validates invocation', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'validate-invocation',
    });

    const executionContext = createMockExecutionContext({
      instanceConfig: integrationConfig,
    });

    await expect(validateInvocation(executionContext)).resolves.toBe(undefined);
  });

  describe('fails validating invocation', () => {
    test('invalid accessToken', async () => {
      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: {
          accessToken: 'blah',
        },
      });

      await expect(() => validateInvocation(executionContext)).rejects.toThrow(
        `Provider authentication failed at ${API_ENDPOINT}: 400 AuthenticationError`,
      );
    });
  });
});
