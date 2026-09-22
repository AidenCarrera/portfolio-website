import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/** Brand text link whose arrow slides forward on hover. */
export default function ArrowLink({
  href,
  children,
  className = "",
}: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-sm font-medium text-brand transition-colors hover:text-brand-pale ${className}`}
    >
      {children}
      <ArrowRight
        size={16}
        aria-hidden="true"
        className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
      />
    </Link>
  );
}
