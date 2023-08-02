import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../config';

const integrationSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: 'fetch-organization-details',
    name: 'Fetch Organization Details',
    entities: [
      {
        resourceName: 'Organization',
        _class: 'Account',
        _type: 'linear_organizatino',
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: () => void 0,
  },
];

export { integrationSteps };
