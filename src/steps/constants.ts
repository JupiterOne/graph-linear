import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';
import { generateRelationshipMetadata } from '../helpers';

export const Steps = {
  ORGANIZATION: 'fetch-organization',
  TEAM: 'fetch-teams',
  PROJECT: 'fetch-projects',
  USERS: 'fetch-users',
} satisfies Record<string, `fetch-${string}`>;

export const Entities = {
  USER: {
    resourceName: 'User',
    _type: 'linear_user',
    _class: ['User'],
  },
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'linear_organization',
    _class: ['Account'],
  },
  TEAM: {
    resourceName: 'Team',
    _type: 'linear_team',
    _class: ['Team', 'UserGroup'],
  },
  PROJECT: {
    resourceName: 'Project',
    _type: 'linear_project',
    _class: ['Project'],
  },
} satisfies Record<string, StepEntityMetadata>;

export const Relationships = {
  ORGANIZATION_HAS_TEAM: generateRelationshipMetadata({
    _class: RelationshipClass.HAS,
    from: Entities.ORGANIZATION,
    to: Entities.TEAM,
  }),
  TEAM_HAS_PROJECT: generateRelationshipMetadata({
    _class: RelationshipClass.HAS,
    from: Entities.TEAM,
    to: Entities.PROJECT,
  }),
  ORGANIZATION_HAS_USER: generateRelationshipMetadata({
    _class: RelationshipClass.HAS,
    from: Entities.ORGANIZATION,
    to: Entities.USER,
  }),
} satisfies Record<string, StepRelationshipMetadata>;
