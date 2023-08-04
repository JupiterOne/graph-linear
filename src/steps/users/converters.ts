import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities, Relationships } from '../constants';
import { Organization, User } from '@linear/sdk';
import { createEntityKey, createRelationship } from '../../helpers';

export function createUserEntity(
  user: User,
  organization: Organization,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: createEntityKey(Entities.USER, user.id),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        displayName: user.displayName,
        createdOn: parseTimePropertyValue(user.createdAt),

        username: user.displayName,
        admin: user.admin,
        email: user.email,

        guest: user.guest,
        webLink: user.url,

        lastSeen: parseTimePropertyValue(user.lastSeen),

        name: user.name,

        id: user.id,

        picture: user.avatarUrl,
        active: user.active,
        organization: organization.id,
      },
    },
  });
}

export function createOrganizationHasUserRelationship({
  organizationEntity,
  userEntity,
}: {
  organizationEntity: Entity;
  userEntity: Entity;
}) {
  return createRelationship({
    relationship: Relationships.ORGANIZATION_HAS_USER,
    from: organizationEntity,
    to: userEntity,
  });
}
