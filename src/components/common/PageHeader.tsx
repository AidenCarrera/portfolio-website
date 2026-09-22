import type { ReactNode } from "react";
import Reveal from "@/components/common/Reveal";
import { CONTAINER } from "@/lib/styles";

interface PageHeaderProps {
  title: string;
  /** Lead copy under the title. */
  children?: ReactNode;
  /** Anything that belongs to the header but not the lead, e.g. actions. */
  footer?: ReactNode;
}

/** Opening block for the inner pages. */
export default function PageHeader({
  title,
  children,
  footer,
}: PageHeaderProps) {
  return (
    <header>
      <div className={`${CONTAINER} pt-14 pb-14 sm:pt-20 sm:pb-20`}>
        <Reveal>
          <h1 className="text-title max-w-4xl text-white">{title}</h1>
          {children && (
            <div className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              {children}
            </div>
          )}
          {footer && <div className="mt-8">{footer}</div>}
        </Reveal>
      </div>
    </header>
  );
}
