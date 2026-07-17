// lib/github.ts

export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  isCollab: boolean; // explicitly mark if it's a contributed/collaborated repo
  createdAt: string; // ISO timestamp for sorting by newest
  priority: number; // manually curated priority rank
  isFeatured: boolean; // boolean flag for display of visual "Featured" badge
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

// Last-known public project data keeps the page useful during GitHub API outages.
const FALLBACK_GITHUB_REPOS: GithubRepo[] = [
  {
    name: "stillwater-pulse",
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
    priority: 1,
    isFeatured: true,
  },
  {
    name: "olo-eq",
    description:
      "A JUCE-based audio plugin implementing a parametric EQ with low-cut, high-cut, and peak filters, supporting VST3, AU, and standalone formats.",
    html_url: "https://github.com/AidenCarrera/olo-eq",
    homepage: null,
    topics: ["cpp", "juce", "audio", "music", "vst3", "dsp"],
    isCollab: false,
    createdAt: "2025-10-21T20:42:55Z",
    priority: 2,
    isFeatured: true,
  },
  {
    name: "solfege-piano",
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
    priority: 3,
    isFeatured: true,
  },
  {
    name: "opengl-audio-visualizer",
    description:
      "OpenGL 4.5 audio visualizer with FFT-based frequency analysis and reactive 3D graphics. Built in C++ with GLFW and ImGui for a computer graphics course.",
    html_url: "https://github.com/AidenCarrera/opengl-audio-visualizer",
    homepage: null,
    topics: ["audio", "cmake", "dsp", "fft", "music", "opengl", "cpp"],
    isCollab: false,
    createdAt: "2026-05-07T02:05:25Z",
    priority: 4,
    isFeatured: false,
  },
  {
    name: "spyfall-clone",
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
    priority: 5,
    isFeatured: false,
  },
  {
    name: "ai-learning",
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
    priority: 6,
    isFeatured: false,
  },
  {
    name: "portfolio-website",
    description:
      "My personal portfolio website, featuring my projects, original music, and contact information.",
    html_url: "https://github.com/AidenCarrera/portfolio-website",
    homepage: "https://aidencarrera.vercel.app/",
    topics: ["audio", "music", "nextjs", "tailwindcss", "typescript", "react"],
    isCollab: false,
    createdAt: "2025-10-30T05:25:44Z",
    priority: 8,
    isFeatured: false,
  },
  {
    name: "cyberlock-senior-capstone",
    description:
      "A full-stack, multiplayer cyberpunk Tabletop RPG featuring real-time combat, persistent character progression, and dynamic storytelling powered by AI-driven NPCs.",
    html_url: "https://github.com/SeanS-git/SeniorCapstone",
    homepage: null,
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
    isCollab: true,
    createdAt: "2026-01-20T20:18:32Z",
    priority: 9,
    isFeatured: false,
  },
  {
    name: "paperclip-collector",
    description:
      "Nibs’ Paperclip Collector is a Java game about a raccoon collecting paperclips around a cluttered office desk, built from scratch with a focus on gameplay and game logic.",
    html_url: "https://github.com/AidenCarrera/paperclip-collector",
    homepage: null,
    topics: ["jackson", "java", "json", "maven", "game"],
    isCollab: false,
    createdAt: "2025-10-23T07:17:12Z",
    priority: 10,
    isFeatured: false,
  },
  {
    name: "fitsync",
    description:
      "A web application built with ASP.NET Core and MariaDB that tracks fitness metrics and utilizes Google AI Studio to generate personalized workouts based on user progress.",
    html_url: "https://github.com/JManB055/ProjectMaVe",
    homepage: null,
    topics: ["ai", "aspnet", "docker", "mariadb", "csharp", "gemini-api"],
    isCollab: true,
    createdAt: "2025-09-19T14:06:50Z",
    priority: 12,
    isFeatured: false,
  },
  {
    name: "random-webs",
    description:
      "A large collection of small, interactive, and experimental websites showcasing unique web interactions.",
    html_url: "https://github.com/AidenCarrera/random-webs",
    homepage: "https://random-webs.vercel.app",
    topics: ["audio", "nextjs", "react", "tailwindcss", "tonejs", "typescript"],
    isCollab: false,
    createdAt: "2025-12-11T08:21:12Z",
    priority: 999,
    isFeatured: false,
  },
];

function getFallbackGithubRepos(): GithubRepo[] {
  return FALLBACK_GITHUB_REPOS.map((repo) => ({
    ...repo,
    topics: [...repo.topics],
  }));
}

/**
 * Fetches public GitHub repositories and collaborations for the user.
 */
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
      next: { revalidate: process.env.NODE_ENV === "development" ? 0 : 300 }, // No cache in dev, 5 min cache in prod
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
        topics = ["ai", "aspnet", "docker", "mariadb", "csharp", "gemini-api"];
      }

      const priority = PROJECT_PRIORITY[node.name] ?? 999;
      // Only the top 3 suggested are visually tagged as Featured
      const isFeatured = [
        "stillwater-pulse",
        "olo-eq",
        "solfege-piano",
      ].includes(node.name);

      return {
        name: repoName,
        description: description,
        html_url: node.url,
        homepage: node.homepageUrl || null,
        topics: topics,
        isCollab:
          isContributed ||
          !isOwner ||
          (node.collaborators?.totalCount ?? 0) > 1,
        createdAt: node.createdAt,
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

    const repos = Array.from(uniqueMap.values());
    return repos.length > 0 ? repos : getFallbackGithubRepos();
  } catch (err) {
    console.error("Error fetching GitHub repos:", err);
    return getFallbackGithubRepos();
  }
}
