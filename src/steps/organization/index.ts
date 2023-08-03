import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';
import { APIClient } from '../../client';
import { createAccountEntity } from './converter';

export const fetchOrganization = async ({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  const client = new APIClient(instance.config);
  const organization = await client.getOrganization();

  await jobState.addEntity(createAccountEntity(organization));
};

export const organizationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ORGANIZATION,
    name: 'Fetch Organization',
    entities: [Entities.ORGANIZATION],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchOrganization,
  },
];
