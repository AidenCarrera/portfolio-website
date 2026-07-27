export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  isCollab: boolean;
  createdAt: string;
  priority: number;
  isFeatured: boolean;
}

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

const DEFAULT_PRIORITY = 999;

// Keyed by GitHub repository name, which is what every lookup below uses.
const PROJECT_PRIORITY: Record<string, number> = {
  "stillwater-pulse": 1,
  "olo-eq": 2,
  "solfege-piano": 3,
  "opengl-audio-visualizer": 4,
  "spyfall-clone": 5,
  "ai-learning": 6,
  "random-webs": 7,
  "portfolio-website": 8,
  SeniorCapstone: 9,
  "paperclip-collector": 10,
  "neetcode-submissions": 11,
  ProjectMaVe: 12,
};

const FEATURED_REPOS = new Set(["stillwater-pulse", "olo-eq", "solfege-piano"]);

// Repos whose GitHub identity differs from how they are presented here.
const REPO_OVERRIDES: Record<
  string,
  { name: string; description: string; topics: string[] }
> = {
  SeniorCapstone: {
    name: "cyberlock-senior-capstone",
    description:
      "A full-stack, multiplayer cyberpunk Tabletop RPG featuring real-time combat, persistent character progression, and dynamic storytelling powered by AI-driven NPCs.",
    topics: [
      "chromadb",
      "fastapi",
      "nodejs",
      "react",
      "socketio",
      "typescript",
      "python",
      "game",
    ],
  },
  ProjectMaVe: {
    name: "fitsync",
    description:
      "A web application built with ASP.NET Core and MariaDB that tracks fitness metrics and utilizes Google AI Studio to generate personalized workouts based on user progress.",
    topics: ["ai", "aspnet", "docker", "mariadb", "csharp", "gemini-api"],
  },
};

// Static fallback preserves project content when GitHub is unavailable.
// Description and topics are omitted where REPO_OVERRIDES supplies them.
interface FallbackSeed {
  repoName: string;
  html_url: string;
  homepage: string | null;
  isCollab: boolean;
  createdAt: string;
  description?: string;
  topics?: string[];
}

const FALLBACK_SEEDS: FallbackSeed[] = [
  {
    repoName: "stillwater-pulse",
    description:
      "🏆 Winner – OSU Hackathon 2025 Best Theme & Best Use of ElevenLabs AI | Stillwater Pulse gathers Instagram content to help users discover events in Stillwater, enhanced with an AI chatbot and TTS.",
    html_url: "https://github.com/AidenCarrera/stillwater-pulse",
    homepage: "https://stillwaterpulse.vercel.app",
    topics: [
      "ai",
      "elevenlabs",
      "fastapi",
      "nextjs",
      "react",
      "tailwindcss",
      "typescript",
      "gemini-api",
    ],
    isCollab: true,
    createdAt: "2025-11-01T20:18:21Z",
  },
  {
    repoName: "olo-eq",
    description:
      "A JUCE-based audio plugin implementing a parametric EQ with low-cut, high-cut, and peak filters, supporting VST3, AU, and standalone formats.",
    html_url: "https://github.com/AidenCarrera/olo-eq",
    homepage: null,
    topics: ["cpp", "juce", "audio", "music", "vst3", "dsp"],
    isCollab: false,
    createdAt: "2025-10-21T20:42:55Z",
  },
  {
    repoName: "solfege-piano",
    description:
      "Playable piano in your web browser built with Howler.js, featuring real-time solfège playback.",
    html_url: "https://github.com/AidenCarrera/solfege-piano",
    homepage: "https://solfegepiano.vercel.app",
    topics: [
      "audio",
      "howlerjs",
      "nextjs",
      "react",
      "solfege",
      "tailwindcss",
      "typescript",
      "music",
    ],
    isCollab: false,
    createdAt: "2025-10-14T22:04:26Z",
  },
  {
    repoName: "opengl-audio-visualizer",
    description:
      "OpenGL 4.5 audio visualizer with FFT-based frequency analysis and reactive 3D graphics. Built in C++ with GLFW and ImGui for a computer graphics course.",
    html_url: "https://github.com/AidenCarrera/opengl-audio-visualizer",
    homepage: null,
    topics: ["audio", "cmake", "dsp", "fft", "music", "opengl", "cpp"],
    isCollab: false,
    createdAt: "2026-05-07T02:05:25Z",
  },
  {
    repoName: "spyfall-clone",
    description:
      "Spyfall-style social deduction game built with Next.js, with multiplayer lobbies, role assignment, and a clean mobile-friendly UI.",
    html_url: "https://github.com/AidenCarrera/spyfall-clone",
    homepage: "https://spyfall-clone.vercel.app",
    topics: [
      "multiplayer",
      "nextjs",
      "redis",
      "tailwindcss",
      "typescript",
      "game",
      "react",
    ],
    isCollab: false,
    createdAt: "2025-11-28T07:08:19Z",
  },
  {
    repoName: "ai-learning",
    description:
      "OpenDeck is a website that generates flashcards, quizzes, and tests using AI.",
    html_url: "https://github.com/AidenCarrera/ai-learning",
    homepage: null,
    topics: [
      "ai",
      "fastapi",
      "nextjs",
      "ollama",
      "python",
      "tailwindcss",
      "typescript",
      "react",
    ],
    isCollab: false,
    createdAt: "2025-10-07T19:08:56Z",
  },
  {
    repoName: "random-webs",
    description:
      "A large collection of small, interactive, and experimental websites showcasing unique web interactions.",
    html_url: "https://github.com/AidenCarrera/random-webs",
    homepage: "https://random-webs.vercel.app",
    topics: ["audio", "nextjs", "react", "tailwindcss", "tonejs", "typescript"],
    isCollab: false,
    createdAt: "2025-12-11T08:21:12Z",
  },
  {
    repoName: "portfolio-website",
    description:
      "My personal portfolio website, featuring my projects, original music, and contact information.",
    html_url: "https://github.com/AidenCarrera/portfolio-website",
    homepage: "https://aidencarrera.vercel.app/",
    topics: ["audio", "music", "nextjs", "tailwindcss", "typescript", "react"],
    isCollab: false,
    createdAt: "2025-10-30T05:25:44Z",
  },
  {
    repoName: "SeniorCapstone",
    html_url: "https://github.com/SeanS-git/SeniorCapstone",
    homepage: null,
    isCollab: true,
    createdAt: "2026-01-20T20:18:32Z",
  },
  {
    repoName: "paperclip-collector",
    description:
      "Nibs’ Paperclip Collector is a Java game about a raccoon collecting paperclips around a cluttered office desk, built from scratch with a focus on gameplay and game logic.",
    html_url: "https://github.com/AidenCarrera/paperclip-collector",
    homepage: null,
    topics: ["jackson", "java", "json", "maven", "game"],
    isCollab: false,
    createdAt: "2025-10-23T07:17:12Z",
  },
  {
    repoName: "ProjectMaVe",
    html_url: "https://github.com/JManB055/ProjectMaVe",
    homepage: null,
    isCollab: true,
    createdAt: "2025-09-19T14:06:50Z",
  },
];

function getFallbackGithubRepos(): GithubRepo[] {
  return FALLBACK_SEEDS.map((seed) => {
    const override = REPO_OVERRIDES[seed.repoName];

    return {
      name: override?.name ?? seed.repoName,
      description: override?.description ?? seed.description ?? "",
      html_url: seed.html_url,
      homepage: seed.homepage,
      topics: [...(override?.topics ?? seed.topics ?? [])],
      isCollab: seed.isCollab,
      createdAt: seed.createdAt,
      priority: PROJECT_PRIORITY[seed.repoName] ?? DEFAULT_PRIORITY,
      isFeatured: FEATURED_REPOS.has(seed.repoName),
    };
  });
}

export async function getGithubRepos(): Promise<GithubRepo[]> {
  const token = process.env.GITHUB_PAT;
  const username = "aidencarrera";

  if (!token) {
    console.error("Missing GITHUB_PAT environment variable");
    return getFallbackGithubRepos();
  }

  const query = `
    {
      user(login: "${username}") {
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
      body: JSON.stringify({ query }),
      next: { revalidate: process.env.NODE_ENV === "development" ? 0 : 300 },
    });

    const { data, errors } = await res.json();

    if (errors) {
      console.error("GitHub GraphQL errors:", errors);
      return getFallbackGithubRepos();
    }

    const user = data?.user;
    if (!user) return getFallbackGithubRepos();

    const mapNode = (
      node: GraphQLRepoNode,
      isContributed: boolean,
    ): GithubRepo => {
      const isOwner = node.owner.login.toLowerCase() === username.toLowerCase();
      const override = REPO_OVERRIDES[node.name];

      return {
        name: override?.name ?? node.name,
        description: override?.description ?? node.description ?? "",
        html_url: node.url,
        homepage: node.homepageUrl || null,
        topics:
          override?.topics ??
          node.repositoryTopics.nodes.map((t) => t.topic.name),
        isCollab:
          isContributed ||
          !isOwner ||
          (node.collaborators?.totalCount ?? 0) > 1,
        createdAt: node.createdAt,
        priority: PROJECT_PRIORITY[node.name] ?? DEFAULT_PRIORITY,
        isFeatured: FEATURED_REPOS.has(node.name),
      };
    };

    const mainRepos = (user.repositories.nodes as GraphQLRepoNode[])
      .filter((n) => !n.isPrivate && (!n.isFork || n.owner.login !== username))
      .map((n) => mapNode(n, false));

    const contributed = (
      user.repositoriesContributedTo.nodes as GraphQLRepoNode[]
    )
      .filter((n) => !n.isPrivate)
      .map((n) => mapNode(n, true));

    // Prefer collaborative records when the API returns duplicate URLs.
    const uniqueMap = new Map<string, GithubRepo>();
    [...mainRepos, ...contributed].forEach((repo) => {
      if (!uniqueMap.has(repo.html_url) || repo.isCollab) {
        uniqueMap.set(repo.html_url, repo);
      }
    });

    const repos = Array.from(uniqueMap.values());
    return repos.length > 0 ? repos : getFallbackGithubRepos();
  } catch (err) {
    console.error("Error fetching GitHub repos:", err);
    return getFallbackGithubRepos();
  }
}
