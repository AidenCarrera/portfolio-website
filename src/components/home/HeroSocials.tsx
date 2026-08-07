import { socialLinks } from "@/lib/socialLinks";

/**
 * `socialLinks` is built from server-only environment variables, so the client
 * hero cannot import it. This renders on the server and is passed in as a prop.
 */
export default function HeroSocials() {
  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <ul className="flex items-center justify-center gap-3 sm:gap-4">
      {socialLinks.map((link) => (
        <li key={link.label}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={`inline-flex rounded-lg p-2 text-slate-400 transition-all duration-300 ease-in-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${link.color}`}
          >
            <link.icon size={22} />
          </a>
        </li>
      ))}
    </ul>
  );
}
