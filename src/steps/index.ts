import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../config';
import { organizationSteps } from './organization';
import { teamSteps } from './team';
import { projectSteps } from './project';
import { userSteps } from './users';

const integrationSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [...organizationSteps, ...teamSteps, ...projectSteps, ...userSteps];

export { integrationSteps };
