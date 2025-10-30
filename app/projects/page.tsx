"use client";

import { Code2, ExternalLink, Github, Folder } from "lucide-react";
import { useEffect, useState } from "react";

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
}

export default function Projects() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/users/aidencarrera/repos?per_page=100&sort=updated"
        );
        const data: GithubRepo[] = await res.json();
        if (Array.isArray(data)) {
          setRepos(
            data.map((repo) => ({
              ...repo,
              topics: repo.topics || [],
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching GitHub repos:", err);
      }
    };
    fetchRepos();
  }, []);

  const categories = [
    "all",
    ...new Set(repos.flatMap((r) => r.topics.map((t) => t.toLowerCase())))
  ];
  const filteredRepos =
    selectedCategory === "all"
      ? repos
      : repos.filter((r) => r.topics.map((t) => t.toLowerCase()).includes(selectedCategory));

  const getStackIcon = (stack: string) => {
    const icons: { [key: string]: string } = {
      react: "⚛️",
      typescript: "🔷",
      javascript: "🟨",
      python: "🐍",
      cpp: "⚙️",
      node: "🟢",
      vite: "⚡",
      supabase: "⚡",
      juce: "🎵",
      tailwind: "🌊",
      next: "⏭️",
      howler: "🎵",
    };

    const lowerStack = stack.toLowerCase();
    // Return first matching icon where key is included in the stack string
    for (const key in icons) {
      if (lowerStack.includes(key)) return icons[key];
    }

    return "🔧"; // default icon
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-amber-400 to-orange-500 mb-6">
            <Code2 size={32} className="text-slate-900" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Projects</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            My GitHub repositories: software projects, music tech experiments, and creative tools.
          </p>
        </div>

        {repos.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-amber-500 text-slate-900"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}

        {filteredRepos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-amber-400/50 transition-all group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                    <Folder size={24} className="text-amber-400" />
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-all"
                    >
                      <Github size={20} />
                    </a>
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-all"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {repo.name}
                </h3>

                <p className="text-slate-400 text-sm mb-4 grow">
                  {repo.description || "No description"}
                </p>

                <div className="flex flex-wrap gap-2">
                  {repo.topics.map((tech, idx) => {
                    const icon = getStackIcon(tech);
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300"
                      >
                        <span>{icon}</span>
                        <span className="capitalize">{tech.replace(/-/g, " ")}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
            <Code2 size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-6">
              Repositories will appear here once your GitHub account has public projects.
            </p>
          </div>
        )}

        <div className="mt-16 text-center">
          <a
            href="https://github.com/aidencarrera"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Github size={20} />
            <span className="font-medium">View more on GitHub</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
