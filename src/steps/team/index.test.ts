import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';

describe('Fetch teams step', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('fetches teams correctly', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetch-teams',
    });

    const stepConfig = buildStepTestConfigForStep(Steps.TEAM);
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
