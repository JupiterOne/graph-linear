import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../config';
import { organizationSteps } from './organization';
import { teamSteps } from './team';
import { projectSteps } from './project';

const integrationSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [...organizationSteps, ...teamSteps, ...projectSteps];

export { integrationSteps };
