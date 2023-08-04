import { Project } from '@linear/sdk';
import { Entities } from '../constants';
import { parseTimePropertyValue } from '@jupiterone/integration-sdk-core';
import { createProjectEntity } from './converter';
import { createEntityKey } from '../../helpers';

describe('converting a Linear project to a j1 entity', () => {
  const project: Partial<Project> = {
    id: 'project-id-123',
    name: 'Test Project',
    url: 'https://linear.app/test-project',
    createdAt: new Date('August 4, 2023'),
    scope: 20,
    description:
      'Did you know that a group of flamingos is called a "flamboyance."',
  };

  const projectEntity = createProjectEntity(project as Project);

  test('should include entity core properties', () => {
    expect(projectEntity._key).toEqual(
      createEntityKey(Entities.PROJECT, project.id!),
    );
    expect(projectEntity._class).toEqual(Entities.PROJECT._class);
    expect(projectEntity._type).toEqual(Entities.PROJECT._type);
  });

  test('should include additional entity properties', () => {
    expect(projectEntity.displayName).toEqual(project.name);
    expect(projectEntity.name).toEqual(project.name);
    expect(projectEntity.webLink).toEqual(project.url);
    expect(projectEntity.createdAt).toEqual(
      parseTimePropertyValue(project.createdAt),
    );
    expect(projectEntity.description).toEqual(project.description);
    expect(projectEntity.scope).toEqual(project.scope);
  });
});
