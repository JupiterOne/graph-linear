import {
  Issue,
  LinearClient,
  Organization,
  PageInfo,
  Project,
  Team,
  User,
} from '@linear/sdk';
import { IntegrationConfig } from './config';
import { IntegrationLogger } from '@jupiterone/integration-sdk-core';

import { wrapWithRetry } from './wrapWithRetry';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

interface PaginatedResponse<T> {
  nodes: T[];
  pageInfo: PageInfo;
}

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(
    readonly config: IntegrationConfig,
    readonly logger: IntegrationLogger,
  ) {}

  private linearClient = new LinearClient({
    apiKey: this.config.accessToken,
  });

  public async verifyAuthentication(): Promise<void> {
    const me = await wrapWithRetry({
      fetchFunction: () => this.linearClient.viewer,
      logger: this.logger,
    })();
    if (me.createdAt) return;
  }

  public async getOrganization(): Promise<Organization> {
    return await this.linearClient.organization;
  }

  public async iterateProjects(iteratee: ResourceIteratee<Project>) {
    await this.iteratePaginatedData<Project>(
      async (cursor?: string) =>
        await this.linearClient.projects({
          after: cursor,
          first: 100,
        }),
      iteratee,
    );
  }

  public async iterateTeams(iteratee: ResourceIteratee<Team>) {
    await this.iteratePaginatedData<Team>(
      async (cursor?: string) =>
        await this.linearClient.teams({
          after: cursor,
          first: 100,
        }),
      iteratee,
    );
  }

  public async iterateUsers(iteratee: ResourceIteratee<User>) {
    await this.iteratePaginatedData<User>(
      async (cursor?: string) =>
        await this.linearClient.users({
          after: cursor,
          first: 100,
        }),
      iteratee,
    );
  }

  public async iterateIssues(iteratee: ResourceIteratee<Issue>) {
    await this.iteratePaginatedData<Issue>(
      async (cursor?: string) =>
        await this.linearClient.issues({
          after: cursor,
          first: 100,
        }),
      iteratee,
    );
  }

  public async iterateTeamsForProject(
    project: Project,
    iteratee: ResourceIteratee<Team>,
  ) {
    await this.iteratePaginatedData<Team>(
      async (cursor?: string) =>
        await project.teams({
          after: cursor,
          first: 100,
        }),
      iteratee,
    );
  }

  public async iterateUsersForProjectId(
    projectId: string,
    iteratee: ResourceIteratee<User>,
  ): Promise<void> {
    const project = await this.linearClient.project(projectId);
    await this.iteratePaginatedData<User>(
      async (after) => await project.members({ after, first: 100 }),
      iteratee,
    );
  }

  async iteratePaginatedData<T>(
    fetchFunction: (cursor?: string) => Promise<PaginatedResponse<T>>,
    iteratee: ResourceIteratee<T>,
  ): Promise<void> {
    let hasMore: boolean;
    let endCursor: string | undefined;

    do {
      const response = await wrapWithRetry({
        fetchFunction: () => fetchFunction(endCursor),
        logger: this.logger,
      })();
      if (response?.nodes && response.nodes.length > 0) {
        for (const each of response.nodes) {
          await iteratee(each);
        }
        hasMore = response?.pageInfo.hasNextPage || false;
        endCursor = response?.pageInfo.endCursor;
      } else {
        hasMore = false;
      }
    } while (hasMore && endCursor);
  }
}

let client;

export function getOrCreateAPIClient(
  config: IntegrationConfig,
  logger,
): APIClient {
  if (!client || client.config.accessToken !== config.accessToken) {
    client = new APIClient(config, logger);
  }
  return client;
}
