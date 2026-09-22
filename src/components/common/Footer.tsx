import Link from "next/link";
import SocialIcons from "@/components/common/SocialIcons";
import { CONTAINER } from "@/lib/styles";

interface FooterProps {
  name: string;
}

export default function Footer({ name }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-line">
      <div
        className={`${CONTAINER} flex flex-col-reverse items-start justify-between gap-4 py-6 text-xs text-muted sm:flex-row sm:items-center`}
      >
        <p className="flex items-center gap-3">
          <span>
            &copy; {new Date().getFullYear()} {name}
          </span>
          <span aria-hidden="true" className="text-slate-700">
            /
          </span>
          <Link
            href="/privacy"
            className="rounded-sm transition-colors hover:text-brand"
          >
            Privacy
          </Link>
        </p>
        <SocialIcons />
      </div>
    </footer>
  );
}
