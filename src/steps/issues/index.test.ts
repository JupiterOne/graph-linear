import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';

describe('Fetch issues step', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetch-issues',
    });
  });

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('fetches issues correctly', async () => {
    const stepConfig = buildStepTestConfigForStep(Steps.ISSUE);
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
