import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "@/lib/socialLinks";

export default function ConnectCard() {
  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="connect-heading">
      <h2 id="connect-heading" className="eyebrow text-muted">
        Connect
      </h2>
      <ul className="mt-4 border-t border-line">
        {socialLinks.map((link) => (
          <li key={link.label} className="border-b border-line">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-sm py-4 transition-colors"
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-slate-400 transition-colors group-hover:border-line-strong ${link.groupColor}`}
              >
                <link.icon size={17} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 font-medium text-slate-200 transition-colors group-hover:text-white">
                {link.label}
              </span>
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="shrink-0 text-slate-600 transition-all duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
