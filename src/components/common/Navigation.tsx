"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

// Far enough down that a stray pixel of scroll does not flicker the bar.
const SCROLL_THRESHOLD = 16;

const NAV_ITEMS = [
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Resume", path: "/resume" },
  { label: "Music", path: "/music" },
  { label: "Contact", path: "/contact" },
] as const;

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

function subscribeToScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getScrolled() {
  return window.scrollY > SCROLL_THRESHOLD;
}

/** The server has no scroll position, so the bar starts out transparent. */
function getServerScrolled() {
  return false;
}

interface NavigationProps {
  name: string;
  /** Server-rendered social links for the mobile menu's footer. */
  socials?: ReactNode;
}

export default function Navigation({ name, socials }: NavigationProps) {
  const pathname = usePathname();
  // The menu remembers the page it was opened on, so any navigation, including
  // back and forward, closes it without an effect to watch the route.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrolled,
    getServerScrolled,
  );

  const isActive = (path: string) => pathname.startsWith(path);

  // While the menu covers the page, the page behind it should neither scroll
  // nor take focus or clicks.
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const background = document.querySelectorAll("main, footer");
    const root = document.documentElement;
    root.style.overflow = "hidden";
    background.forEach((element) => element.setAttribute("inert", ""));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuPath(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      root.style.overflow = "";
      background.forEach((element) => element.removeAttribute("inert"));
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Condensed into a floating pill once the page moves; an open menu wants the
  // plain bar so the close button sits on the overlay, not in a capsule.
  const condensed = scrolled && !menuOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-2 sm:px-4">
      <nav
        aria-label="Primary"
        className={`relative mx-auto flex h-14 items-center justify-between rounded-full border transition-[max-width,background-color,border-color,box-shadow,padding] duration-500 ease-out-expo ${
          condensed
            ? "max-w-4xl border-line bg-ink-900/75 pr-2 pl-2 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl"
            : "max-w-7xl border-transparent pr-1 pl-1 sm:pr-3 sm:pl-3"
        }`}
      >
        {/* The wordmark is the only route back to the landing page now that
            Home has left the nav, so it names that destination outright
            rather than leaving assistive tech with a bare name. */}
        <Link
          href="/"
          aria-label={`${name} — home`}
          aria-current={pathname === "/" ? "page" : undefined}
          className="group flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 font-semibold tracking-tight text-white"
        >
          <Image
            src="/developer-logo.svg"
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full shadow-[0_0_20px_-4px_rgb(0_255_204/0.6)] transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg]"
            priority
          />
          <span className="text-[0.9375rem]">{name}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`relative isolate block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    active ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full border border-line-strong bg-white/[0.06]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setMenuPath(menuOpen ? null : pathname)}
          className="relative flex size-11 items-center justify-center rounded-full text-white md:hidden"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span aria-hidden="true" className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out-expo ${
                menuOpen ? "top-[5px] rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 rounded-full bg-current transition-all duration-300 ease-out-expo ${
                menuOpen ? "top-[5px] w-5 -rotate-45" : "top-2.5 w-3.5"
              }`}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 -z-10 flex flex-col overflow-y-auto bg-ink-950/95 px-6 pt-28 pb-10 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
          >
            <ul className="relative space-y-1">
              {NAV_ITEMS.map((item, index) => {
                const active = isActive(item.path);

                return (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: EASE_OUT_EXPO,
                      delay: 0.05 + index * 0.05,
                    }}
                  >
                    <Link
                      href={item.path}
                      onClick={() => setMenuPath(null)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-baseline gap-4 rounded-lg py-2.5 text-[2.5rem] leading-none font-semibold tracking-[-0.04em] transition-colors ${
                        active ? "text-brand" : "text-white hover:text-brand"
                      }`}
                    >
                      <span className="eyebrow w-6 text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            {socials && (
              <motion.div
                className="relative mt-auto border-t border-line pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                <p className="eyebrow mb-4 text-muted">Elsewhere</p>
                {socials}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
