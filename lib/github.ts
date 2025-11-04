// lib/github.ts

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  owner: string;       // GitHub username of the owner
  isCollab: boolean;   // explicitly mark if it's a contributed repo
}

/**
 * Fetches GitHub repositories for a given user.
 * Cached for 1 hour using Next.js revalidation.
 */
export async function fetchGithubRepos(username: string): Promise<GithubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { next: { revalidate: 3600 } } // cache for 1 hour
    );

    if (!res.ok) throw new Error("Failed to fetch GitHub repos");

    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data
      .filter((r) => r && typeof r.id === "number")
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        topics: repo.topics || [],
        owner: repo.owner?.login ?? username, // set owner
        isCollab: repo.owner?.login !== username, // mark as contributed repo
      }));
  } catch (err) {
    console.error("Error fetching GitHub repos:", err);
    return [];
  }
}
