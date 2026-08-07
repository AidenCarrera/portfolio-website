"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * The App Router only moves the scroll position if the incoming page's root
 * element has left the viewport, so a link clicked near the top of a long page
 * leaves you part-way down the new one with the fixed nav over its start.
 * Pinning the top on forward navigations makes every link behave the same way.
 *
 * Back and forward are left alone so the router's scroll restoration still
 * returns to wherever the visitor was.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const isHistoryNavigation = useRef(false);

  useEffect(() => {
    const markHistoryNavigation = () => {
      isHistoryNavigation.current = true;
    };

    window.addEventListener("popstate", markHistoryNavigation);
    return () => window.removeEventListener("popstate", markHistoryNavigation);
  }, []);

  useEffect(() => {
    // A first paint has nothing to correct, and jumping here would fight a
    // deep link that arrived with a hash.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      return;
    }

    if (window.location.hash) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
