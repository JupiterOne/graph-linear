import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Project } from '@linear/sdk';
import { Entities, Relationships } from '../constants';
import { createEntityKey, createRelationship } from '../../helpers';

export const createProjectEntity = (project: Project): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _key: createEntityKey(Entities.PROJECT, project.id),
        _class: Entities.PROJECT._class,
        _type: Entities.PROJECT._type,
        displayName: project.name,
        name: project.name,
        description: project.description,
        webLink: project.url,
        createdAt: parseTimePropertyValue(project.createdAt),
        scope: project.scope,
      },
    },
  });
};

export const createTeamProjectRelationship = ({
  teamEntity,
  projectEntity,
}: {
  teamEntity: Entity;
  projectEntity: Entity;
}) => {
  return createRelationship({
    relationship: Relationships.TEAM_HAS_PROJECT,
    from: teamEntity,
    to: projectEntity,
  });
};
