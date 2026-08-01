import { cache } from "react";
import { getGithubRepos } from "@/lib/github";
import { getSanityProjects } from "@/sanity/content";
import type { SanityProject } from "@/sanity/types";
import type { GithubRepo } from "@/types";

// Repositories without a curated display order sort after the curated ones.
const DEFAULT_DISPLAY_ORDER = 999;
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

// Sanity documents key off the owner/repository identity in the GitHub URL.
function getGithubRepositoryIdentity(repositoryUrl: string): string {
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

function getProjectSlug(repo: GithubRepo): string {
  return repo.name.trim().toLowerCase();
}

function mergeGithubRepoWithSanity(
  github: GithubRepo,
  content: SanityProject | null,
): PortfolioProject {
  const displayOrder = content?.displayOrder ?? DEFAULT_DISPLAY_ORDER;
  const tagsOverwrite = content?.tagsOverwrite
    ?.map((tag) => tag.trim())
    .filter(Boolean);

  return {
    github,
    githubRepository: getGithubRepositoryIdentity(github.html_url),
    slug: getProjectSlug(github),
    content,
    presentation: {
      featured: displayOrder >= 1 && displayOrder <= 3,
      displayOrder,
      repoName: content?.repoNameOverwrite?.trim() || github.name,
      cardDescription:
        content?.cardDescription?.trim() ||
        github.description?.trim() ||
        SAFE_PROJECT_DESCRIPTION,
      tags: tagsOverwrite?.length ? tagsOverwrite : github.topics,
    },
  };
}

export const getPortfolioProjects = cache(
  async (): Promise<PortfolioProject[]> => {
    const [githubRepos, sanityProjects] = await Promise.all([
      getGithubRepos(),
      getSanityProjects(),
    ]);
    const contentByRepository = new Map(
      sanityProjects.map((content) => [
        content.githubRepository.trim().toLowerCase(),
        content,
      ]),
    );

    return githubRepos.map((github) => {
      const repository = getGithubRepositoryIdentity(
        github.html_url,
      ).toLowerCase();
      return mergeGithubRepoWithSanity(
        github,
        contentByRepository.get(repository) ?? null,
      );
    });
  },
);

export const getProjectBySlug = cache(
  async (slug: string): Promise<PortfolioProject | null> => {
    const normalizedSlug = slug.trim().toLowerCase();
    const projects = await getPortfolioProjects();

    return projects.find((project) => project.slug === normalizedSlug) ?? null;
  },
);

/** Ensures unique project slugs across repositories to prevent static generation & sitemap errors. */
export const getRoutableProjects = cache(
  async (): Promise<PortfolioProject[]> => {
    const projects = await getPortfolioProjects();
    const firstBySlug = new Map<string, PortfolioProject>();

    for (const project of projects) {
      if (!firstBySlug.has(project.slug)) {
        firstBySlug.set(project.slug, project);
      }
    }

    return Array.from(firstBySlug.values());
  },
);
