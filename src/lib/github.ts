// lib/github.ts

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  owner: string; // GitHub username of the owner
  isCollab: boolean; // explicitly mark if it's a contributed/collaborated repo
  pushedAt: string; // ISO timestamp for sorting by newest
  priority: number; // manually curated priority rank
  isFeatured: boolean; // boolean flag for display of visual "Featured" badge
}

interface GraphQLRepoNode {
  databaseId: number;
  name: string;
  description?: string | null;
  url: string;
  homepageUrl?: string | null;
  isPrivate: boolean;
  isFork: boolean;
  owner: { login: string };
  repositoryTopics: { nodes: { topic: { name: string } }[] };
  collaborators?: { totalCount: number };
  pushedAt: string;
}

// Manually curated project order behind the scenes
const PROJECT_PRIORITY: Record<string, number> = {
  "stillwater-pulse": 1,
  "olo-eq": 2,
  "solfege-piano": 3,
  "opengl-audio-visualizer": 4,
  "spyfall-clone": 5,
  "ai-learning": 6,
  "random-web": 7,
  "portfolio-website": 8,
  SeniorCapstone: 9,
  "paperclip-collector": 10,
  "neetcode-submissions": 11,
  ProjectMaVe: 12,
};

/**
 * Fetches public GitHub repositories and collaborations for the user.
 */
export async function getGithubRepos(): Promise<GithubRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  const username = "aidencarrera";

  if (!token) {
    console.error("Missing GITHUB_TOKEN environment variable");
    return [];
  }

  const query = `
    {
      user(login: "${username}") {
        repositories(
          first: 100, 
          privacy: PUBLIC, 
          ownerAffiliations: [OWNER, COLLABORATOR], 
          orderBy: {field: UPDATED_AT, direction: DESC}
        ) {
          nodes {
            databaseId
            name
            description
            url
            homepageUrl
            isPrivate
            isFork
            owner { login }
            repositoryTopics(first: 10) { nodes { topic { name } } }
            collaborators { totalCount }
            pushedAt
          }
        }
        repositoriesContributedTo(
          first: 50,
          contributionTypes: [COMMIT, PULL_REQUEST, REPOSITORY],
          includeUserRepositories: false
        ) {
          nodes {
            databaseId
            name
            description
            url
            homepageUrl
            isPrivate
            isFork
            owner { login }
            repositoryTopics(first: 10) { nodes { topic { name } } }
            pushedAt
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
      body: JSON.stringify({ query }),
      next: { revalidate: process.env.NODE_ENV === "development" ? 0 : 300 }, // No cache in dev, 5 min cache in prod
    });

    const { data, errors } = await res.json();

    if (errors) {
      console.error("GitHub GraphQL errors:", errors);
      return [];
    }

    const user = data?.user;
    if (!user) return [];

    const mapNode = (
      node: GraphQLRepoNode,
      isContributed: boolean,
    ): GithubRepo => {
      const isOwner = node.owner.login.toLowerCase() === username.toLowerCase();
      let repoName = node.name;
      let description = node.description ?? "";
      let topics = node.repositoryTopics.nodes.map((t) => t.topic.name);

      if (node.name === "SeniorCapstone") {
        repoName = "cyberlock-senior-capstone";
        description =
          "A full-stack, multiplayer cyberpunk Tabletop RPG featuring real-time combat, persistent character progression, and dynamic storytelling powered by AI-driven NPCs.";
        topics = [
          "chromadb",
          "fastapi",
          "nodejs",
          "react",
          "socketio",
          "typescript",
          "python",
          "game",
        ];
      } else if (node.name === "ProjectMaVe") {
        repoName = "fitsync";
        description =
          "A web application built with ASP.NET Core and MariaDB that tracks fitness metrics and utilizes Google AI Studio to generate personalized workouts based on user progress.";
        topics = [
          "ai",
          "aspnet",
          "docker",
          "mariadb",
          "html-css",
          "csharp",
          "gemini api",
        ];
      }

      const priority = PROJECT_PRIORITY[node.name] ?? 999;
      // Only the top 3 suggested are visually tagged as Featured
      const isFeatured = [
        "stillwater-pulse",
        "olo-eq",
        "solfege-piano",
      ].includes(node.name);

      return {
        id: node.databaseId,
        name: repoName,
        description: description,
        html_url: node.url,
        homepage: node.homepageUrl || null,
        topics: topics,
        owner: node.owner.login,
        isCollab:
          isContributed ||
          !isOwner ||
          (node.collaborators?.totalCount ?? 0) > 1,
        pushedAt: node.pushedAt,
        priority,
        isFeatured,
      };
    };

    // Process sets
    // 1. Owned/Collaborated: filter for public only, and exclude forks (unless it's a collab)
    const mainRepos = (user.repositories.nodes as GraphQLRepoNode[])
      .filter((n) => !n.isPrivate && (!n.isFork || n.owner.login !== username))
      .map((n) => mapNode(n, false));

    // 2. Contributed To: filter for public only
    const contributed = (
      user.repositoriesContributedTo.nodes as GraphQLRepoNode[]
    )
      .filter((n) => !n.isPrivate)
      .map((n) => mapNode(n, true));

    // Deduplicate by URL
    const uniqueMap = new Map<string, GithubRepo>();
    [...mainRepos, ...contributed].forEach((repo) => {
      if (!uniqueMap.has(repo.html_url) || repo.isCollab) {
        uniqueMap.set(repo.html_url, repo);
      }
    });

    return Array.from(uniqueMap.values());
  } catch (err) {
    console.error("Error fetching GitHub repos:", err);
    return [];
  }
}
