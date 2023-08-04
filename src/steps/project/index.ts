import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { APIClient } from '../../client';
import {
  createProjectEntity,
  createTeamProjectRelationship,
} from './converter';
import { createEntityKey } from '../../helpers';

export const fetchProjects = async ({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  const client = new APIClient(instance.config);
  const projects = await client.getProjects();

  for (const project of projects) {
    const teams = await client.getTeamsForProject(project);

    const projectEntity = createProjectEntity(project);
    await jobState.addEntity(projectEntity);

    const teamsEntityKeys = teams.map((team) =>
      createEntityKey(Entities.TEAM, team.id),
    );

    for (const teamEntityKey of teamsEntityKeys) {
      const teamEntity = await jobState.findEntity(teamEntityKey);
      if (teamEntity) {
        await jobState.addRelationship(
          createTeamProjectRelationship({
            teamEntity: teamEntity,
            projectEntity: projectEntity,
          }),
        );
      }
    }
  }
};

export const projectSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.PROJECT,
    name: 'Fetch Projects',
    entities: [Entities.PROJECT],
    relationships: [Relationships.TEAM_HAS_PROJECT],
    dependsOn: [Steps.TEAM],
    executionHandler: fetchProjects,
  },
];
