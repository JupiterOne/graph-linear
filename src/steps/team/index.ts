import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { APIClient } from '../../client';
import {
  createOrganizationTeamRelationship,
  createTeamEntity,
} from './converter';
import { createEntityKey } from '../entityKeyUtil';

export const fetchTeams = async ({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  const client = new APIClient(instance.config);
  const teams = await client.getTeams();

  for (const team of teams) {
    const teamOrg = await team.organization;

    const teamEntity = createTeamEntity(team, teamOrg);
    await jobState.addEntity(teamEntity);

    const orgEntityKey = createEntityKey(
      Entities.ORGANIZATION._type,
      teamOrg.id,
    );

    const orgEntity = await jobState.findEntity(orgEntityKey);

    if (orgEntity) {
      await jobState.addRelationship(
        createOrganizationTeamRelationship({
          organization: orgEntity,
          team: teamEntity,
        }),
      );
    }
  }
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
