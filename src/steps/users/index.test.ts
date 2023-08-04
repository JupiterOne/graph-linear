import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';

describe('Fetch organization step', () => {
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

    await executeStepWithDependencies(
      buildStepTestConfigForStep(Steps.ORGANIZATION),
    );
    const stepConfig = buildStepTestConfigForStep(Steps.USERS);
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
