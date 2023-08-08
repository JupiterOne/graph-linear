import {
  Issue,
  Organization,
  PageInfo,
  Project,
  LinearSdk,
  Team,
  User,
  parseLinearError,
} from '@linear/sdk';
import { DocumentNode, print } from 'graphql';
import { IntegrationConfig } from './config';
import { IntegrationLogger } from '@jupiterone/integration-sdk-core';

import { wrapWithRetry } from './wrapWithRetry';
import axios, { Axios } from 'axios';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

interface PaginatedResponse<T> {
  nodes: T[];
  pageInfo: PageInfo;
}

class AxiosLinearClient extends LinearSdk {
  private _axios: Axios;
  private _apiUrl = 'https://api.linear.app/graphql';
  public constructor({ apiKey }: { apiKey: string }) {
    super(
      async <Variables extends Record<string, unknown>>(
        doc: DocumentNode,
        variables?: Variables,
      ) => {
        let response;
        try {
          response = await this._axios.post(this._apiUrl, {
            query: print(doc),
            variables,
          });
          return response.data.data;
        } catch (error) {
          if (response) {
            throw parseLinearError(response.data);
          }
          throw parseLinearError(error);
        }
      },
    );
    this._axios = axios.create({
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }
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

  private linearClient = new AxiosLinearClient({
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
