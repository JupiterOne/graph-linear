import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../config';
import { organizationSteps } from './organization';

const integrationSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [...organizationSteps];

export { integrationSteps };
