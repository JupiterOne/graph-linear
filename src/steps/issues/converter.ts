import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Issue } from '@linear/sdk';
import { Entities } from '../constants';
import { createEntityKey } from '../../helpers';

export const convertIssueEntity = (issue: Issue): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: issue,
      assign: {
        _key: createEntityKey(Entities.ISSUE, issue.id),
        _class: Entities.ISSUE._class,
        _type: Entities.ISSUE._type,
        displayName: issue.title,
        id: issue.identifier,
        name: issue.title,
        description: issue.description,
        webLink: encodeURI(issue.url),
        priority: issue.priorityLabel,
        estimate: issue.estimate,
        createdAt: parseTimePropertyValue(issue.createdAt),
        dueDate: parseTimePropertyValue(issue.dueDate),
      },
    },
  });
};
