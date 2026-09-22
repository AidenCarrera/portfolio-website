import { socialLinks } from "@/lib/socialLinks";

interface SocialIconsProps {
  className?: string;
}

/**
 * `socialLinks` is built from server-only environment variables, so client
 * components cannot import it. This renders on the server and is handed to
 * them as a prop.
 */
export default function SocialIcons({ className = "" }: SocialIconsProps) {
  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {socialLinks.map((link) => (
        <li key={link.label}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={`inline-flex size-10 items-center justify-center rounded-full border border-line bg-white/[0.02] text-slate-400 transition-[border-color,color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-line-strong ${link.color}`}
          >
            <link.icon size={17} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
