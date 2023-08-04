import {
  Entity,
  RelationshipClass,
  createDirectRelationship,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Organization, Team } from '@linear/sdk';
import { Entities } from '../constants';
import { createEntityKey } from '../entityKeyUtil';

export const createTeamEntity = (team: Team, teamOrg: Organization): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: team,
      assign: {
        _key: createEntityKey(Entities.TEAM._type, team.id),
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
  organization,
  team,
}: {
  organization: Entity;
  team: Entity;
}) => {
  return createDirectRelationship({
    from: organization,
    to: team,
    _class: RelationshipClass.HAS,
  });
};
