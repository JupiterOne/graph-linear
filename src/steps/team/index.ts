import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { getOrCreateAPIClient } from '../../client';
import {
  createOrganizationTeamRelationship,
  createTeamEntity,
} from './converter';
import { createEntityKey } from '../../helpers';

export const fetchTeams = async ({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  const client = getOrCreateAPIClient(instance.config, logger);
  await client.iterateTeams(async (team) => {
    const teamOrg = await team.organization;

    const teamEntity = createTeamEntity(team, teamOrg);
    await jobState.addEntity(teamEntity);

    const orgEntityKey = createEntityKey(Entities.ORGANIZATION, teamOrg.id);

    const organizationEntity = await jobState.findEntity(orgEntityKey);

    if (organizationEntity) {
      await jobState.addRelationship(
        createOrganizationTeamRelationship({
          organizationEntity,
          teamEntity,
        }),
      );
    }
  });
};

export const teamSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.TEAM,
    name: 'Fetch Teams',
    entities: [Entities.TEAM],
    relationships: [Relationships.ORGANIZATION_HAS_TEAM],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchTeams,
  },
];
