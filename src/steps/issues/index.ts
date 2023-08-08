import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { getOrCreateAPIClient } from '../../client';
import { convertIssueEntity } from './converter';
import { createEntityKey } from '../../helpers';

const tryToGetId = (issueEntity: Entity, key: string) => {
  try {
    return (issueEntity._rawData?.[0].rawData as any)[key].id;
  } catch (e) {
    return undefined;
  }
};

export const fetchIssues = async ({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  const client = getOrCreateAPIClient(instance.config, logger);
  const issues = await client.getIssues();

  for (const issue of issues) {
    const issueEntity = await jobState.addEntity(convertIssueEntity(issue));
    const teamId = tryToGetId(issueEntity, '_team');
    if (teamId) {
      const teamEntity = await jobState.findEntity(
        createEntityKey(Entities.TEAM, teamId),
      );
      if (teamEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: teamEntity,
            to: issueEntity,
            _class: RelationshipClass.HAS,
          }),
        );
      }
    }
    const projectId = tryToGetId(issueEntity, '_project');
    if (projectId) {
      const projectEntity = await jobState.findEntity(
        createEntityKey(Entities.PROJECT, projectId),
      );
      if (projectEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: projectEntity,
            to: issueEntity,
            _class: RelationshipClass.HAS,
          }),
        );
      }
    }

    const creatorId = tryToGetId(issueEntity, '_creator');
    if (creatorId) {
      const creatorEntity = await jobState.findEntity(
        createEntityKey(Entities.USER, creatorId),
      );
      if (creatorEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: creatorEntity,
            to: issueEntity,
            _class: RelationshipClass.CREATED,
          }),
        );
      }
    }

    const assigneeId = tryToGetId(issueEntity, '_assignee');
    if (assigneeId) {
      const assigneeEntity = await jobState.findEntity(
        createEntityKey(Entities.USER, assigneeId),
      );
      if (assigneeEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: assigneeEntity,
            to: issueEntity,
            _class: RelationshipClass.ASSIGNED,
          }),
        );
      }
    }
  }
};

export const relateIssues = async ({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) => {
  await jobState.iterateEntities(
    {
      _type: Entities.ISSUE._type,
    },
    async (issueEntity) => {
      const parentId = tryToGetId(issueEntity, '_parent');
      if (parentId) {
        const parentIssueEntity = await jobState.findEntity(
          createEntityKey(Entities.ISSUE, parentId),
        );
        if (parentIssueEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              from: parentIssueEntity,
              to: issueEntity,
              _class: RelationshipClass.CONTAINS,
            }),
          );
        }
      }
    },
  );
};

export const issueSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ISSUE,
    name: 'Fetch Issues',
    entities: [Entities.ISSUE],
    relationships: [
      Relationships.TEAM_HAS_ISSUE,
      Relationships.PROJECT_HAS_ISSUE,
      Relationships.USER_ASSIGNED_ISSUE,
      Relationships.USER_CREATED_ISSUE,
    ],
    dependsOn: [Steps.TEAM, Steps.PROJECT, Steps.USERS],
    executionHandler: fetchIssues,
  },
  {
    id: Steps.RELATE_ISSUES_TO_ISSUES,
    name: 'Relate Issues',
    entities: [Entities.ISSUE],
    relationships: [Relationships.ISSUE_CONTAINS_ISSUE],
    dependsOn: [Steps.ISSUE],
    executionHandler: relateIssues,
  },
];
