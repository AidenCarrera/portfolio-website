import type { ComponentType } from "react";
import { Database } from "lucide-react";
import * as SimpleIcons from "react-icons/si";

export type TechIcon = ComponentType<{
  className?: string;
  "aria-hidden"?: true;
}>;

const SIMPLE_ICONS = SimpleIcons as unknown as Record<
  string,
  TechIcon | undefined
>;

function toSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/\./g, "dot")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

// Maps name slugs to Simple Icons exports when the brand slug differs
const SLUG_ALIASES: Record<string, string> = {
  java: "openjdk",
  csharp: "dotnet",
  aspdotnetcore: "dotnet",
  html: "html5",
  maven: "apachemaven",
};

// Skills that name a technology rather than a product
const CONCEPT_ICONS: Record<string, TechIcon> = {
  sql: Database,
  chromadb: Database,
};

export function getTechIcon(name: string): TechIcon | undefined {
  const slug = toSlug(name);
  if (!slug) return undefined;

  const concept = CONCEPT_ICONS[slug];
  if (concept) return concept;

  const resolved = SLUG_ALIASES[slug] ?? slug;
  return SIMPLE_ICONS[`Si${resolved[0].toUpperCase()}${resolved.slice(1)}`];
}
