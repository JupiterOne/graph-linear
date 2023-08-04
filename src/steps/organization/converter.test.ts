import { Organization } from '@linear/sdk';
import { Entities } from '../constants';
import { parseTimePropertyValue } from '@jupiterone/integration-sdk-core';
import { createEntityKey } from '../../helpers';
import { createOrganizationEntity } from './converter';

describe('converting a Linear organization to a j1 entity', () => {
  const organization: Partial<Organization> = {
    id: 'organization-id-123',
    name: 'Test Organization',
    urlKey: 'test-organization',
    createdAt: new Date('August 4, 2023'),
    roadmapEnabled: true,
    samlEnabled: false,
    scimEnabled: false,
    userCount: 10,
    createdIssueCount: 100,
  };

  const entity = createOrganizationEntity(organization as Organization);

  test('should include entity core properties', () => {
    expect(entity._key).toEqual(
      createEntityKey(Entities.ORGANIZATION, organization.id!),
    );
    expect(entity._class).toEqual(Entities.ORGANIZATION._class);
    expect(entity._type).toEqual(Entities.ORGANIZATION._type);
  });

  test('should include additional entity properties', () => {
    expect(entity.displayName).toEqual(organization.name);
    expect(entity.name).toEqual(organization.name);
    expect(entity.webLink).toEqual(`https://linear.app/${organization.urlKey}`);
    expect(entity.createdAt).toEqual(
      parseTimePropertyValue(organization.createdAt),
    );
    expect(entity.roadmapEnabled).toEqual(organization.roadmapEnabled);
    expect(entity.samlEnabled).toEqual(organization.samlEnabled);
    expect(entity.scimEnabled).toEqual(organization.scimEnabled);
    expect(entity.userCount).toEqual(organization.userCount);
    expect(entity.createdIssueCount).toEqual(organization.createdIssueCount);
  });
});
