import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';
import { getOrCreateAPIClient } from '../../client';
import { createOrganizationEntity } from './converter';

export const fetchOrganization = async ({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  const client = getOrCreateAPIClient(instance.config, logger);
  const organization = await client.getOrganization();

  await jobState.addEntity(createOrganizationEntity(organization));
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
