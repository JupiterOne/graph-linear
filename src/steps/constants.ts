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
  ISSUE: 'fetch-issues',
  RELATE_ISSUES_TO_ISSUES: 'relate-issues-to-issues',
  RELATE_PROJECTS_TO_USERS: 'relate-projects-to-users',
} satisfies Record<string, string>;

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
  ISSUE: {
    resourceName: 'Issue',
    _type: 'linear_issue',
    _class: ['Record', 'Issue'],
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
  TEAM_HAS_USER: generateRelationshipMetadata({
    _class: RelationshipClass.HAS,
    from: Entities.TEAM,
    to: Entities.USER,
  }),
  PROJECT_HAS_USER: generateRelationshipMetadata({
    _class: RelationshipClass.HAS,
    from: Entities.PROJECT,
    to: Entities.USER,
  }),
  TEAM_HAS_ISSUE: generateRelationshipMetadata({
    _class: RelationshipClass.HAS,
    from: Entities.TEAM,
    to: Entities.ISSUE,
  }),
  PROJECT_HAS_ISSUE: generateRelationshipMetadata({
    _class: RelationshipClass.HAS,
    from: Entities.PROJECT,
    to: Entities.ISSUE,
  }),
  USER_CREATED_ISSUE: generateRelationshipMetadata({
    _class: RelationshipClass.CREATED,
    from: Entities.USER,
    to: Entities.ISSUE,
  }),
  ISSUE_ASSIGNED_USER: generateRelationshipMetadata({
    _class: RelationshipClass.ASSIGNED,
    from: Entities.ISSUE,
    to: Entities.USER,
  }),
  ISSUE_CONTAINS_ISSUE: generateRelationshipMetadata({
    _class: RelationshipClass.CONTAINS,
    from: Entities.ISSUE,
    to: Entities.ISSUE,
  }),
} satisfies Record<string, StepRelationshipMetadata>;
