import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Organization } from '@linear/sdk';
import { Entities } from '../constants';
import { createEntityKey } from '../../helpers';

export const createOrganizationEntity = (
  organization: Organization,
): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: organization,
      assign: {
        _key: createEntityKey(Entities.ORGANIZATION, organization.id),
        _class: Entities.ORGANIZATION._class,
        _type: Entities.ORGANIZATION._type,
        displayName: organization.name,
        name: organization.name,
        webLink: `https://linear.app/${organization.urlKey}`,
        createdAt: parseTimePropertyValue(organization.createdAt),
        roadmapEnabled: organization.roadmapEnabled,
        samlEnabled: organization.samlEnabled,
        scimEnabled: organization.scimEnabled,
        userCount: organization.userCount,
        createdIssueCount: organization.createdIssueCount,
      },
    },
  });
};
