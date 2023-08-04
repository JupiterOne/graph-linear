import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Organization, Team } from '@linear/sdk';
import { Entities, Relationships } from '../constants';
import { createEntityKey, createRelationship } from '../../helpers';

export const createTeamEntity = (team: Team, teamOrg: Organization): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: team,
      assign: {
        _key: createEntityKey(Entities.TEAM, team.id),
        _class: Entities.TEAM._class,
        _type: Entities.TEAM._type,
        displayName: team.name,
        name: team.name,
        description: team.description,
        webLink: `https://linear.app/${teamOrg.urlKey}/team/${team.key}`,
        createdAt: parseTimePropertyValue(team.createdAt),
        issueCount: team.issueCount,
        organization: teamOrg.id,
      },
    },
  });
};

export const createOrganizationTeamRelationship = ({
  organizationEntity,
  teamEntity,
}: {
  organizationEntity: Entity;
  teamEntity: Entity;
}) => {
  return createRelationship({
    relationship: Relationships.ORGANIZATION_HAS_TEAM,
    from: organizationEntity,
    to: teamEntity,
  });
};
