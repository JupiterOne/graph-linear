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

  public async getProjects(): Promise<Project[]> {
    const fetchFunction = async (cursor?: string) =>
      await this.linearClient.projects({
        after: cursor,
      });

    const projects = await this.fetchPaginatedData<Project>(fetchFunction);
    return projects;
  }

  public async getTeams(): Promise<Team[]> {
    const fetchFunction = async (cursor?: string) =>
      await this.linearClient.teams({
        after: cursor,
      });

    const teams = await this.fetchPaginatedData<Team>(fetchFunction);
    return teams;
  }

  public async getUsers(): Promise<User[]> {
    const fetchFunction = async (cursor?: string) =>
      await this.linearClient.users({
        after: cursor,
      });

    const users = await this.fetchPaginatedData<User>(fetchFunction);
    return users;
  }

  public async getIssues(): Promise<Issue[]> {
    const fetchFunction = async (cursor?: string) =>
      await this.linearClient.issues({
        after: cursor,
      });

    const issues = await this.fetchPaginatedData<Issue>(fetchFunction);
    return issues;
  }

  public async getTeamsForProject(project: Project): Promise<Team[]> {
    const fetchFunction = async (cursor?: string) =>
      await project.teams({
        after: cursor,
      });

    const teams = await this.fetchPaginatedData<Team>(fetchFunction);
    return teams;
  }

  public async getUsersForProjectId(projectId: string): Promise<User[]> {
    const project = await this.linearClient.project(projectId);
    return await this.fetchPaginatedData<User>(
      async (after) => await project.members({ after }),
    );
  }

  async fetchPaginatedData<T>(
    fetchFunction: (cursor?: string) => Promise<PaginatedResponse<T>>,
  ): Promise<T[]> {
    let hasMore: boolean;
    let endCursor: string | undefined;
    const data: T[] = [];

    do {
      const response = await wrapWithRetry({
        fetchFunction: () => fetchFunction(endCursor),
        logger: this.logger,
      })();
      hasMore = response?.pageInfo.hasNextPage || false;
      endCursor = response?.pageInfo.endCursor;
      data.push(...(response?.nodes || []));
    } while (hasMore);

    return data;
  }
}

let client;

export function getOrCreateAPIClient(
  config: IntegrationConfig,
  logger,
): APIClient {
  if (!client) {
    client = new APIClient(config, logger);
  }
  return client;
}
