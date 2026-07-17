import { ExternalLink, Folder } from "lucide-react";
import { SiGithub } from "react-icons/si";
import type { GithubRepo } from "@/lib/github";
import { formatTagName } from "@/lib/utils";

interface RepoCardProps {
  repo: GithubRepo;
}

export default function RepoCard({ repo }: RepoCardProps) {
  return (
    <div className="h-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-brand/50 transition-all group flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-brand/10 to-brand-dark/5 border border-brand/20 flex items-center justify-center shadow-inner">
            <Folder
              size={18}
              className="text-brand filter drop-shadow-[0_2px_6px_rgba(0,255,204,0.25)]"
            />
          </div>
          {repo.isFeatured && (
            <span className="bg-brand/10 border border-brand/20 text-brand text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full animate-pulse">
              Featured
            </span>
          )}
          {repo.isCollab && (
            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Collab
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:text-brand hover:bg-slate-700/40 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            title="View GitHub Repository"
            aria-label={`View GitHub repository for ${repo.name}`}
          >
            <SiGithub size={20} />
          </a>
          {repo.homepage && repo.homepage.trim() !== "" && (
            <a
              href={
                repo.homepage.startsWith("http")
                  ? repo.homepage
                  : `https://${repo.homepage}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:text-brand hover:bg-slate-700/40 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              title="View Live Site"
              aria-label={`View live site for ${repo.name}`}
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-brand transition-colors">
        {repo.name}
      </h3>

      <p className="text-slate-400 text-sm mb-4 line-clamp-3">
        {repo.description || "No description"}
      </p>

      <div className="flex flex-wrap gap-2">
        {repo.topics.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300"
          >
            <span>{formatTagName(tech)}</span>
          </span>
        ))}
      </div>

      <div className="grow" />
    </div>
  );
}
