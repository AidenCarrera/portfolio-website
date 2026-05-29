import { ExternalLink, Folder } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { getStackIcon } from "@/lib/utils";
import { GithubRepo } from "@/lib/github";

interface RepoCardProps {
  repo?: GithubRepo;
  isGhost?: boolean;
}

export default function RepoCard({ repo, isGhost }: RepoCardProps) {
  if (isGhost)
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 h-64 animate-pulse" />
    );

  return (
    <div className="h-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-brand/50 transition-all group flex flex-col">
      {/* Header: Icon + Links */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Folder Icon and Collab Label side-by-side */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-brand/10 to-brand-dark/5 border border-brand/20 flex items-center justify-center shadow-inner">
            <Folder size={18} className="text-brand filter drop-shadow-[0_2px_6px_rgba(0,255,204,0.25)]" />
          </div>
          {repo?.isCollab && (
            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Collab
            </span>
          )}
        </div>

        {/* Right: GitHub / External Links */}
        <div className="flex space-x-2">
          {/* GitHub link */}
          <a
            href={repo?.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:text-brand hover:bg-slate-700/40 transition-all duration-200"
            title="View GitHub Repository"
          >
            <SiGithub size={20} />
          </a>
          {/* Live website link (if exists) */}
          {repo?.homepage && repo.homepage.trim() !== "" && (
            <a
              href={
                repo.homepage.startsWith("http")
                  ? repo.homepage
                  : `https://${repo.homepage}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:text-brand hover:bg-slate-700/40 transition-all duration-200"
              title="View Live Site"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Repo name */}
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-brand transition-colors">
        {repo?.name || "Loading..."}
      </h3>

      {/* Description: clamped to 3 lines */}
      <p className="text-slate-400 text-sm mb-4 line-clamp-3">
        {repo?.description || "No description"}
      </p>

      {/* Topics */}
      <div className="flex flex-wrap gap-2">
        {repo?.topics.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300"
          >
            {getStackIcon(tech)}
            <span className="capitalize">{tech.replace(/-/g, " ")}</span>
          </span>
        ))}
      </div>

      {/* Spacer to push card bottom */}
      <div className="grow" />
    </div>
  );
}
