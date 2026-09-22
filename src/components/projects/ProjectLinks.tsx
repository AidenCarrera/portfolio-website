import { ArrowUpRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import type { PortfolioProject } from "@/lib/projects";
import { ICON_BUTTON } from "@/lib/styles";
import { getLiveUrl } from "@/lib/utils";

interface ProjectLinksProps {
  project: PortfolioProject;
  className?: string;
}

/**
 * Repository and live-site buttons. They sit above a card's full-size overlay
 * link, so the caller's layer has to leave pointer events on for them.
 */
export default function ProjectLinks({
  project,
  className = "",
}: ProjectLinksProps) {
  const name = project.presentation.repoName;
  const liveUrl = getLiveUrl(project.github.homepageUrl);

  return (
    <div className={`relative z-20 flex shrink-0 gap-2 ${className}`}>
      <a
        href={project.github.url}
        target="_blank"
        rel="noopener noreferrer"
        className={ICON_BUTTON}
        title="View GitHub repository"
        aria-label={`View GitHub repository for ${name}`}
      >
        <SiGithub size={16} aria-hidden="true" />
      </a>
      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={ICON_BUTTON}
          title="View live site"
          aria-label={`View live site for ${name}`}
        >
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
