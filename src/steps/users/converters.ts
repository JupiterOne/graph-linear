import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities, Relationships } from '../constants';
import { User } from '@linear/sdk';
import { createEntityKey, createRelationship } from '../../helpers';

export function createUserEntity(
  user: User,
  assignments?: { [key: string]: any },
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

        // The `name` property is required by the schema, but is not necessarily
        // set in the `profile`, so we fall back to `id`.
        name: user.name || user.id,

        id: user.id,

        picture: user.avatarUrl,
        active: user.active,
        ...assignments,
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
