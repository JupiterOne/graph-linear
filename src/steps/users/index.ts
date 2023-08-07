import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { getOrCreateAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import {
  createOrganizationHasUserRelationship,
  createUserEntity,
} from './converters';
import { createEntityKey } from '../../helpers';

export const fetchUsers = async ({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  const client = getOrCreateAPIClient(instance.config, logger);
  const users = await client.getUsers();

  for (const user of users) {
    const organization = await user.organization;
    const userEntity = createUserEntity(user, organization);
    await jobState.addEntity(userEntity);

    const organizationEntity = await jobState.findEntity(
      createEntityKey(Entities.ORGANIZATION, organization.id),
    );
    if (organizationEntity) {
      await jobState.addRelationship(
        createOrganizationHasUserRelationship({
          organizationEntity,
          userEntity,
        }),
      );
    }
  }
};

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.ORGANIZATION_HAS_USER],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchUsers,
  },
];
