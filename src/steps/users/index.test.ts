import {
  Recording,
  createMockStepExecutionContext,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { fetchTeams } from '../team';
import { IntegrationConfig } from '../../config';
import { fetchUsers } from '.';

describe('Fetch users step', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('fetches users correctly', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetch-users',
    });

    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchTeams(context);
    await fetchUsers(context);

    expect(context.jobState.collectedEntities).toHaveLength(7);
  }, 60_000);
});
