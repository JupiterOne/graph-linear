import {
  Entity,
  RelationshipClass,
  createDirectRelationship,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Project } from '@linear/sdk';
import { Entities } from '../constants';
import { createEntityKey } from '../entityKeyUtil';

export const createProjectEntity = (project: Project): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _key: createEntityKey(Entities.PROJECT._type, project.id),
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
  team,
  project,
}: {
  team: Entity;
  project: Entity;
}) => {
  return createDirectRelationship({
    from: team,
    to: project,
    _class: RelationshipClass.HAS,
  });
};
