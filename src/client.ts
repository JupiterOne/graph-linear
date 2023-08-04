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
import { IntegrationError } from '@jupiterone/integration-sdk-core';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

interface PaginatedResponse<T> {
  nodes: T[];
  pageInfo: PageInfo;
}

// When authenticated using an API key you can make up to 1,500 requests per hour. Requests are associated with the authenticated user, which means all requests by the same user share the same quota even when using different API keys.

// Requests authenticated using an API key can request up to 250,000 points per hour.**Complexity points

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  // private MAX_RETRIES = 3;

  private linearClient = new LinearClient({
    apiKey: this.config.accessToken,
  });

  public async verifyAuthentication(): Promise<void> {
    // TODO: extract the try/catch into helper
    try {
      const me = await this.linearClient.viewer;
      if (me.createdAt) return;
    } catch (err) {
      throw new IntegrationError({
        message: err.message,
        code: err.code,
      });
    }
  }

  public async getOrganization(): Promise<Organization> {
    // TODO: wrap in error handling
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

  async fetchPaginatedData<T>(
    fetchFunction: (cursor?: string) => Promise<PaginatedResponse<T>>,
  ): Promise<T[]> {
    let hasMore: boolean;
    let endCursor: string | undefined;
    const data: T[] = [];

    do {
      const response = await fetchFunction(endCursor);
      hasMore = response.pageInfo.hasNextPage;
      endCursor = response.pageInfo.endCursor;
      data.push(...response.nodes);
    } while (hasMore);

    return data;
  }

  // TODO: retry helper to handle rate limits (and other errors?)
  // import {
  //   AttemptContext,
  //   retry as attemptRetry,
  //   sleep,
  // } from '@lifeomic/attempt';
  // async requestWithRetry<T>(query: LinearFetch<T>) {
  //   let retryCounter = 0;

  //   do {
  //     try {
  //       const response = await query;
  //       return response;
  //     } catch (error) {
  //       if (error instanceof RatelimitedLinearError) {
  //          TODO: get details for rate limit time reset
  //       }

  //       retryCounter++;
  //     }
  //   } while (retryCounter < this.MAX_RETRIES);
  // }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
