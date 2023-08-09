import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { getOrCreateAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { createUserEntity } from './converters';
import { createEntityKey, createRelationship } from '../../helpers';
import { Team } from '@linear/sdk';

export const fetchUsers = async ({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  const client = getOrCreateAPIClient(instance.config, logger);
  await client.iterateUsers(async (user) => {
    const organization = await user.organization;
    const userEntity = await jobState.addEntity(
      createUserEntity(user, organization),
    );

    await client.iteratePaginatedData<Team>(
      async (after) => await user.teams({ after }),
      async (team) => {
        const teamEntity = await jobState.findEntity(
          createEntityKey(Entities.TEAM, team.id),
        );
        if (teamEntity) {
          await jobState.addRelationship(
            createRelationship({
              from: teamEntity,
              to: userEntity,
              relationship: Relationships.TEAM_HAS_USER,
            }),
          );
        }
      },
    );
  });
};

export const relateProjectsToUsers = async ({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  await jobState.iterateEntities(Entities.PROJECT, async (projectEntity) => {
    const projectId = projectEntity.id as string;
    const client = getOrCreateAPIClient(instance.config, logger);
    await client.iterateUsersForProjectId(projectId, async (user) => {
      const userEntity = await jobState.findEntity(
        createEntityKey(Entities.USER, user.id),
      );
      if (userEntity) {
        await jobState.addRelationship(
          createRelationship({
            from: projectEntity,
            to: userEntity,
            relationship: Relationships.PROJECT_HAS_USER,
          }),
        );
      }
    });
  });
};

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.TEAM_HAS_USER],
    dependsOn: [Steps.TEAM],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.RELATE_PROJECTS_TO_USERS,
    name: 'Relate Projects to Users',
    entities: [],
    relationships: [Relationships.PROJECT_HAS_USER],
    dependsOn: [Steps.USERS, Steps.PROJECT],
    executionHandler: relateProjectsToUsers,
  },
];
