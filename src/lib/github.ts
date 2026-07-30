import type { GithubRepo } from "@/types";

interface GraphQLRepoNode {
  name: string;
  description?: string | null;
  url: string;
  homepageUrl?: string | null;
  isPrivate: boolean;
  isFork: boolean;
  owner: { login: string };
  repositoryTopics: { nodes: { topic: { name: string } }[] };
  collaborators?: { totalCount: number };
  createdAt: string;
}

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      repositories: { nodes: GraphQLRepoNode[] };
      repositoriesContributedTo: { nodes: GraphQLRepoNode[] };
    } | null;
  };
  errors?: unknown;
}

const DEFAULT_PRIORITY = 999;

export function getGitHubProfileUrl(): string | null {
  const username = process.env.GITHUB_USERNAME?.trim();
  return username
    ? `https://github.com/${encodeURIComponent(username)}`
    : null;
}

export async function getGithubRepos(): Promise<GithubRepo[]> {
  const token = process.env.GITHUB_PAT?.trim();
  const username = process.env.GITHUB_USERNAME?.trim();

  if (!token || !username) {
    return [];
  }

  const query = `
    query PortfolioRepositories($username: String!) {
      user(login: $username) {
        repositories(
          first: 100,
          privacy: PUBLIC,
          ownerAffiliations: [OWNER, COLLABORATOR],
          orderBy: {field: CREATED_AT, direction: DESC}
        ) {
          nodes {
            name
            description
            url
            homepageUrl
            isPrivate
            isFork
            owner { login }
            repositoryTopics(first: 10) { nodes { topic { name } } }
            collaborators { totalCount }
            createdAt
          }
        }
        repositoriesContributedTo(
          first: 50,
          contributionTypes: [COMMIT, PULL_REQUEST, REPOSITORY],
          includeUserRepositories: false
        ) {
          nodes {
            name
            description
            url
            homepageUrl
            isPrivate
            isFork
            owner { login }
            repositoryTopics(first: 10) { nodes { topic { name } } }
            createdAt
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: process.env.NODE_ENV === "development" ? 0 : 300 },
    });

    if (!res.ok) {
      console.error(`GitHub API request failed with status ${res.status}`);
      return [];
    }

    const { data, errors } =
      (await res.json()) as GitHubGraphQLResponse;

    if (errors) {
      console.error("GitHub GraphQL errors:", errors);
      return [];
    }

    const user = data?.user;
    if (!user) {
      return [];
    }

    const mapNode = (
      node: GraphQLRepoNode,
      isContributed: boolean,
    ): GithubRepo => {
      const isOwner = node.owner.login.toLowerCase() === username.toLowerCase();

      return {
        name: node.name,
        description: node.description ?? "",
        html_url: node.url,
        homepage: node.homepageUrl || null,
        topics: node.repositoryTopics.nodes.map((item) => item.topic.name),
        isCollab:
          isContributed ||
          !isOwner ||
          (node.collaborators?.totalCount ?? 0) > 1,
        createdAt: node.createdAt,
        priority: DEFAULT_PRIORITY,
        isFeatured: false,
      };
    };

    const mainRepos = user.repositories.nodes
      .filter(
        (node) =>
          !node.isPrivate &&
          (!node.isFork ||
            node.owner.login.toLowerCase() !== username.toLowerCase()),
      )
      .map((node) => mapNode(node, false));

    const contributed = user.repositoriesContributedTo.nodes
      .filter((node) => !node.isPrivate)
      .map((node) => mapNode(node, true));

    // Prefer collaborative records when GitHub returns the same URL twice.
    const uniqueRepos = new Map<string, GithubRepo>();
    for (const repo of [...mainRepos, ...contributed]) {
      if (!uniqueRepos.has(repo.html_url) || repo.isCollab) {
        uniqueRepos.set(repo.html_url, repo);
      }
    }

    return Array.from(uniqueRepos.values());
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}
