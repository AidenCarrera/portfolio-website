import RepoCard from "./RepoCard";
import type { PortfolioProject } from "@/lib/projects";

interface RepoGridProps {
  projects: PortfolioProject[];
}

export default function RepoGrid({ projects }: RepoGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <RepoCard key={project.github.html_url} project={project} />
      ))}
    </div>
  );
}
