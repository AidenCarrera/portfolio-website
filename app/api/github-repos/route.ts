import { NextResponse } from "next/server";
import { GithubRepo } from "@/lib/github";

interface GraphQLTopicNode {
  topic: { name: string };
}

interface GraphQLOwner {
  login: string;
}

interface GraphQLRepoNode {
  id?: number;
  name: string;
  description?: string | null;
  url: string;
  homepageUrl?: string | null;
  owner: GraphQLOwner;
  repositoryTopics: { nodes: GraphQLTopicNode[] };
  collaborators?: { totalCount: number };
}

interface GraphQLUserResponse {
  user: {
    repositories: { nodes: GraphQLRepoNode[] };
    repositoriesContributedTo: { nodes: GraphQLRepoNode[] };
  };
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing GitHub token" }, { status: 500 });
  }

  const query = `
    {
      user(login: "aidencarrera") {
        repositoriesContributedTo(
          first: 50,
          contributionTypes: [COMMIT, PULL_REQUEST, REPOSITORY],
          includeUserRepositories: false
        ) {
          nodes {
            id
            name
            description
            url
            homepageUrl   # added this line
            owner { login }
            repositoryTopics(first: 10) { nodes { topic { name } } }
            collaborators(first: 10) { totalCount }
          }
        }
        repositories(first: 50, privacy: PUBLIC, ownerAffiliations: OWNER) {
          nodes {
            id
            name
            description
            url
            homepageUrl   # added this line
            owner { login }
            repositoryTopics(first: 10) { nodes { topic { name } } }
            collaborators(first: 10) { totalCount }
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
    });

    const data = await res.json();

    if (data.errors) {
      return NextResponse.json({ error: "GitHub API errors", details: data.errors }, { status: 500 });
    }

    const userData: GraphQLUserResponse = data.data;

    if (!userData?.user) {
      return NextResponse.json({ data: [] });
    }

    const convertNodeToRepo = (r: GraphQLRepoNode, isContributed: boolean): GithubRepo => ({
      id: r.id ?? Math.floor(Math.random() * 1_000_000),
      name: r.name,
      description: r.description ?? "",
      html_url: r.url,
      homepage: r.homepageUrl ?? null, // now correctly uses homepageUrl
      topics: r.repositoryTopics.nodes.map((t) => t.topic.name),
      owner: r.owner.login,
      isCollab: isContributed || ((r.collaborators?.totalCount ?? 1) > 1),
    });

    const ownedRepos = userData.user.repositories.nodes.map((r) => convertNodeToRepo(r, false));
    const contributedRepos = userData.user.repositoriesContributedTo.nodes.map((r) =>
      convertNodeToRepo(r, true)
    );

    const allRepos = [...ownedRepos, ...contributedRepos];
    const uniqueRepos = Array.from(new Map(allRepos.map((r) => [r.html_url, r])).values());

    return NextResponse.json(uniqueRepos);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "GitHub request failed" }, { status: 500 });
  }
}
