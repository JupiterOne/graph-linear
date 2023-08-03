import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps: Record<string, string> = {
  ORGANIZATION: 'fetch-organization',
  TEAM: 'fetch-teams',
  PROJECT: 'fetch-projects',
};

export const Entities: Record<
  'ORGANIZATION' | 'TEAM' | 'PROJECT',
  StepEntityMetadata
> = {
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'linear_organization',
    _class: ['Account'],
  },
  TEAM: {
    resourceName: 'Team',
    _type: 'linear_team',
    _class: ['UserGroup'],
  },
  PROJECT: {
    resourceName: 'Project',
    _type: 'linear_project',
    _class: ['Project'],
  },
};

export const Relationships: Record<string, StepRelationshipMetadata> = {
  ORGANIZATION_HAS_TEAM: {
    _type: 'linear_organization_has_linear_team',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.TEAM._type,
  },
  ORGANIZATION_HAS_PROJECT: {
    _type: 'linear_organization_has_linear_project',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PROJECT._type,
  },
};
