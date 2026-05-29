# Next.js Route & Layout Refactoring Plan (2026-05-29)

Refactor the portfolio routing and layout structure to align with Next.js App Router standards (Next.js 16 / React 19). We will establish clean server/client boundaries, leverage server-side data fetching for SEO, eliminate duplicate code, and use standard Next.js routing components (`next/link`, `usePathname`).

## Progress Tracker

| Task ID | Description | Status | Risk Level |
| :--- | :--- | :---: | :---: |
| 1 | Create shared Spotify data helper and refactor Music Page (`/music`) | `[x]` | High |
| 2 | Refactor Projects Page (`/projects`) server-side data fetching | `[x]` | High |
| 3 | Refactor Contact Page (`/contact`) to Server Component & add Metadata | `[x]` | Medium |
| 4 | Refactor Navigation to use `next/link` and `usePathname` | `[x]` | Medium |
| 5 | Refactor Homepage (`/`) to Server Component & add Metadata | `[x]` | Low |
| 6 | Perform verification, lint, and build checks | `[x]` | Low |

---

## Architectural Principles & Standards

Following Next.js 16 & React 19 recommendations:
- **Server Components by default**: Keep pages as Server Components to handle SEO metadata and data fetching directly.
- **Client Boundaries**: Push client-only logic (states, custom hooks, animations) to leaf-level client components.
- **Native Routing**: Always use `<Link>` from `next/link` instead of programmatic navigation via `router.push()` for standard anchors. This preserves accessibility, browser behavior (middle click, Cmd+click), and enables Next.js link prefetching.
- **Dynamic Path Detection**: Use `usePathname()` from `next/navigation` to resolve active paths automatically in layout headers rather than passing page state variables.
- **Single Navigation Declaration**: The root layout `app/layout.tsx` renders the `<Navigation />` component. Sub-pages must not declare or render `<Navigation />` again.

---

## Task Details & Proposed Changes

### Task 1: Music Page Refactoring
- **High Risk**: Deals with external API connections and credentials (`SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET`).
- **Proposed Changes**:
  - Extract the Spotify fetching code from [app/api/spotify-tracks/route.ts](file:///c:/Users/aiden/Desktop/projects/websites/portfolio-website/app/api/spotify-tracks/route.ts) into a reusable helper in `lib/spotify.ts`.
  - Update `app/api/spotify-tracks/route.ts` to call this helper, ensuring compatibility for any external client requests.
  - Refactor [app/music/page.tsx](file:///c:/Users/aiden/Desktop/projects/websites/portfolio-website/app/music/page.tsx) to fetch Spotify tracks on the server using the helper and pass them as props to `<ReleasedMusicSection />`.
  - Add SEO metadata to `app/music/page.tsx`.

### Task 2: Projects Page Refactoring
- **High Risk**: Data binding with GitHub API and category filter state.
- **Proposed Changes**:
  - Refactor [app/projects/page.tsx](file:///c:/Users/aiden/Desktop/projects/websites/portfolio-website/app/projects/page.tsx) into a Server Component.
  - Call `getGithubRepos()` directly in `app/projects/page.tsx` during server rendering.
  - Remove the client-side `useEffect` fetch request to `/api/github-repos`.
  - Extract category filter state and repo grid logic to [app/projects/ProjectsClient.tsx](file:///c:/Users/aiden/Desktop/projects/websites/portfolio-website/app/projects/ProjectsClient.tsx).
  - Eliminate the duplicate `<Navigation />` component from the page.
  - Define custom SEO metadata in `app/projects/page.tsx`.

### Task 3: Contact Page Refactoring
- **Medium Risk**: Making sure child client components are correctly bounded.
- **Proposed Changes**:
  - Remove `"use client"` from [app/contact/page.tsx](file:///c:/Users/aiden/Desktop/projects/websites/portfolio-website/app/contact/page.tsx) to make it a Server Component.
  - Add SEO metadata to `app/contact/page.tsx`.
  - Keep form and copy card components as Client Components (`"use client"`).

### Task 4: Navigation Component Refactoring
- **Medium Risk**: Link animation compatibility with `framer-motion` and active route highlights.
- **Proposed Changes**:
  - Refactor [components/common/Navigation.tsx](file:///c:/Users/aiden/Desktop/projects/websites/portfolio-website/components/common/Navigation.tsx).
  - Replace `<motion.button>` with `next/link` wrapped in `motion` or using `motion(Link)` to retain hover lift animations.
  - Integrate `usePathname()` to dynamically highlight the current active link based on URL.

### Task 5: Homepage Refactoring
- **Low Risk**: Standard component layout.
- **Proposed Changes**:
  - Split [app/page.tsx](file:///c:/Users/aiden/Desktop/projects/websites/portfolio-website/app/page.tsx) into a Server Component page and an `app/HomeClient.tsx` Client Component.
  - Move the animations and visual logic to `app/HomeClient.tsx`.
  - Define metadata in `app/page.tsx` for clean SEO.
  - Replace button click handers that use `router.push()` with proper `<Link>` elements.

---

## Verification Plan

### Automated Tests
- Run `pnpm lint` to ensure no linting errors are introduced.
- Run `pnpm build` to compile the app and check for routing/layout and client/server boundary mismatches.

### Manual Verification
- Click through all navigation paths to verify page layouts, smooth transitions, and instant prefetching.
- Check browser tabs to confirm custom SEO titles update on page changes.
- Ensure copying email to clipboard and contact form continue working as expected.
