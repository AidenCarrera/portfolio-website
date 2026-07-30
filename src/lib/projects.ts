import { cache } from "react";
import { getGithubRepos } from "@/lib/github";
import { getSanityProjects } from "@/sanity/data";
import type { SanityProject } from "@/sanity/types";
import type { GithubRepo } from "@/types";

const SAFE_PROJECT_DESCRIPTION = "No description";

export interface PortfolioProject {
  github: GithubRepo;
  githubRepository: string;
  slug: string;
  content: SanityProject | null;
  presentation: {
    featured: boolean;
    displayOrder: number;
    repoName: string;
    cardDescription: string;
    tags: string[];
  };
}

function firstNonEmpty(
  ...values: Array<string | null | undefined>
): string | undefined {
  return values.find((value) => value?.trim())?.trim();
}

function getPresentationTags(
  tagsOverwrite: string[] | undefined,
  githubTopics: string[],
): string[] {
  const configuredTags = tagsOverwrite
    ?.map((tag) => tag.trim())
    .filter(Boolean);

  return configuredTags?.length ? configuredTags : githubTopics;
}

export function getGithubRepositoryIdentity(repositoryUrl: string): string {
  try {
    const pathParts = new URL(repositoryUrl).pathname
      .split("/")
      .filter(Boolean)
      .slice(0, 2);

    if (pathParts.length === 2) {
      return `${pathParts[0]}/${pathParts[1].replace(/\.git$/i, "")}`;
    }
  } catch {
    // Fall through to a stable empty identity for malformed external data.
  }

  return "";
}

export function getProjectSlug(repo: GithubRepo): string {
  return repo.name.trim().toLowerCase();
}

export function mergeGithubRepoWithSanity(
  github: GithubRepo,
  content: SanityProject | null,
): PortfolioProject {
  const displayOrder = content?.displayOrder ?? github.priority;

  return {
    github,
    githubRepository: getGithubRepositoryIdentity(github.html_url),
    slug: getProjectSlug(github),
    content,
    presentation: {
      featured: displayOrder >= 1 && displayOrder <= 3,
      displayOrder,
      repoName:
        firstNonEmpty(content?.repoNameOverwrite, github.name) ?? github.name,
      cardDescription:
        firstNonEmpty(content?.cardDescription, github.description) ??
        SAFE_PROJECT_DESCRIPTION,
      tags: getPresentationTags(content?.tagsOverwrite, github.topics),
    },
  };
}

export const getPortfolioProjects = cache(
  async (): Promise<PortfolioProject[]> => {
    const [githubRepos, sanityProjects] = await Promise.all([
      getGithubRepos(),
      getSanityProjects(),
    ]);
    const contentByRepository = new Map<string, SanityProject>();

    for (const content of sanityProjects) {
      const key = content.githubRepository.trim().toLowerCase();
      contentByRepository.set(key, content);
    }

    return githubRepos.map((github) => {
      const repository = getGithubRepositoryIdentity(github.html_url);
      const content = contentByRepository.get(repository.toLowerCase()) ?? null;
      return mergeGithubRepoWithSanity(github, content);
    });
  },
);

export const getProjectBySlug = cache(
  async (slug: string): Promise<PortfolioProject | null> => {
    const normalizedSlug = slug.trim().toLowerCase();
    const projects = await getPortfolioProjects();

    return (
      projects.find((project) => project.slug === normalizedSlug) ??
      projects.find((project) => {
        const repositoryName = project.githubRepository.split("/").at(-1);
        return repositoryName?.toLowerCase() === normalizedSlug;
      }) ??
      null
    );
  },
);
