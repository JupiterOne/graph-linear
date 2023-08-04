import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';
import { getOrCreateAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import {
  createOrganizationHasUserRelationship,
  createUserEntity,
} from './converters';
import { createEntityKey } from '../../helpers';
import { Team } from '@linear/sdk';

export const fetchUsers = async ({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  const client = getOrCreateAPIClient(instance.config, logger);
  const users = await client.getUsers();

  for (const user of users) {
    const organization = await user.organization;
    const userEntity = await jobState.addEntity(
      createUserEntity(user, organization),
    );

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

    const teams = await client.fetchPaginatedData<Team>(
      async (after) => await user.teams({ after }),
    );
    for (const team of teams) {
      const teamEntity = await jobState.findEntity(
        createEntityKey(Entities.TEAM, team.id),
      );
      if (teamEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: teamEntity,
            to: userEntity,
            _class: Relationships.TEAM_HAS_USER._class,
          }),
        );
      }
    }
  }
};

export const relateProjectsToUsers = async ({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  await jobState.iterateEntities(Entities.PROJECT, async (projectEntity) => {
    const projectId = projectEntity.id as string;
    const client = getOrCreateAPIClient(instance.config, logger);
    const users = await client.getUsersForProjectId(projectId);
    for (const user of users) {
      const userEntity = await jobState.findEntity(
        createEntityKey(Entities.USER, user.id),
      );
      if (userEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: projectEntity,
            to: userEntity,
            _class: RelationshipClass.HAS,
          }),
        );
      }
    }
  });
};

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [
      Relationships.ORGANIZATION_HAS_USER,
      Relationships.TEAM_HAS_USER,
    ],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.RELATE_PROJECTS_TO_USERS,
    name: 'Relate Projects to Users',
    entities: [Entities.PROJECT],
    relationships: [Relationships.PROJECT_HAS_USER],
    dependsOn: [Steps.USERS, Steps.PROJECT],
    executionHandler: relateProjectsToUsers,
  },
];
