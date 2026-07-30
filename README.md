# Portfolio Website

My personal portfolio for software development and music.
It showcases my projects, released music, contact information, and the tools I use as a musician and audio programmer.

## Features

- GitHub project showcase with topic filtering and detail pages
- Cassette tape player for upcoming music snippets
- Spotify embeds for released tracks
- Gear showcase grouped by instruments, hardware, software, and plugins
- Contact form with Resend delivery, validation, and per-IP rate limiting
- Sanity Studio for content managed outside the repository
- Skip links, keyboard-accessible audio controls, and visible focus states
- Automatic sitemap generation and SEO metadata

## Stack

- Next.js 16 and React 19
- TypeScript 6
- Tailwind CSS 4
- Motion
- Resend
- Sanity
- Vercel

## Setup

You'll need Git, Node.js, and pnpm. Fork the repository, then run:

```bash
git clone https://github.com/YOUR_USERNAME/portfolio-website.git
cd portfolio-website
pnpm install
cp .env.example .env.local
pnpm dev
```

The site runs at [localhost:3000](http://localhost:3000) with no configuration, using the defaults in `src/lib/profile.ts` and skipping integrations that are not configured. Fill in `.env.local` to enable the integrations.

The repository contains no fallback accounts or Sanity project IDs, so forks never reference my services.

### Studio

The Studio is hosted by Sanity and is not served from the Next.js app.

```bash
pnpm sanity:dev     # local Studio at localhost:3333
pnpm sanity:deploy  # deploy to *.sanity.studio
```

The first deploy creates the Studio app and returns its ID. Add that value to `SANITY_STUDIO_APP_ID` for later deployments.

Studio commands require a Sanity project ID and dataset, but the website can run without them. If you open the Studio from a new domain, add that origin to the project's CORS settings.

## Environment Variables

Copy [`.env.example`](./.env.example) to `.env.local`. Never commit `.env.local`.

| Variable                   | Used for         | Purpose                                               |
| -------------------------- | ---------------- | ----------------------------------------------------- |
| `SITE_URL`                 | Deployment       | Canonical origin for URLs and metadata                |
| `SANITY_STUDIO_PROJECT_ID` | Sanity content   | Sanity project ID                                     |
| `SANITY_STUDIO_DATASET`    | Sanity content   | Sanity dataset name                                   |
| `SANITY_STUDIO_APP_ID`     | Hosted Studio    | Studio app ID used for later deployments              |
| `SANITY_DISABLED`          | Outage testing   | Disables Sanity to exercise fallback behavior         |
| `GITHUB_PAT`               | GitHub projects  | Authenticates GitHub GraphQL requests                 |
| `GITHUB_USERNAME`          | GitHub projects  | Selects the GitHub account and builds its profile URL |
| `SPOTIFY_CLIENT_ID`        | Spotify releases | Authenticates Spotify API requests                    |
| `SPOTIFY_CLIENT_SECRET`    | Spotify releases | Authenticates Spotify API requests                    |
| `SPOTIFY_ARTIST_ID`        | Spotify releases | Selects the artist whose releases are shown           |
| `RESEND_API_KEY`           | Contact form     | Authenticates email delivery                          |
| `RESEND_FROM_EMAIL`        | Contact form     | Sender verified by the Resend account                 |
| `CONTACT_EMAIL`            | Contact form     | Recipient unless the Sanity Profile provides one      |
| `LINKEDIN_URL`             | Optional link    | LinkedIn profile URL                                  |
| `INSTAGRAM_URL`            | Optional link    | Instagram profile URL                                 |
| `YOUTUBE_URL`              | Optional link    | YouTube channel URL                                   |

All environment variables are server-side only. None use a `NEXT_PUBLIC_` prefix, so they are not exposed to the browser.

`GITHUB_PAT`, `RESEND_API_KEY`, and `SPOTIFY_CLIENT_SECRET` are secret values. The Sanity project ID and dataset are public identifiers.

`SITE_URL` resolves at build time and falls back to the Vercel production domain, then to localhost.

If Sanity is unconfigured, disabled, or unavailable, the site continues to function. The homepage and metadata use the defaults in `src/lib/profile.ts`, projects fall back to GitHub data, and the snippet and gear sections show their empty states.

Set `SANITY_DISABLED=true` to test this fallback behavior.

The contact form requires `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and a recipient through either `CONTACT_EMAIL` or the Sanity Profile email. It allows three submissions per IP per minute, tracked in memory.

## Content

GitHub is the source of truth for repository data, including names, descriptions, topics, links, ownership, and dates. Sanity enriches that data with portfolio-specific content.

A `Projects` document matches a repository by its exact `owner/repository` identity and can add images, detail-page content, highlights, display order, and optional overrides for the repository name, description, and tags.

Display order values `1` through `3` are marked Featured automatically. The Newest and Name sorts remain GitHub-driven.

The other Sanity schemas are:

- **Profile** - a singleton document containing my name, email, About Me content, landing copy, slogan, and resume PDF. It feeds the homepage, navigation, footer, metadata, and contact details.
- **Music** - audio snippets with a name and audio file, displayed in creation order. No snippet audio files live in the repository.
- **Gear Item** - gear entries with a type, optional category, and sort order. Plugins are grouped by category.

Sanity integration code lives in `src/sanity`:

- `env.ts` handles Sanity configuration
- `client.ts` configures the Sanity client and fallback-aware fetching
- `content.ts` contains queries and typed content getters
- `types.ts` defines content shapes
- `schemaTypes/` contains Studio schemas
- `structure.ts` defines the Studio structure

Sanity reads happen in Server Components through the Sanity CDN and are cached for one hour. No write token is used by the website.

## Deploying

Add the required `.env.local` values to the Vercel project. `SANITY_STUDIO_APP_ID` is only required in environments where `pnpm sanity:deploy` runs.

Before pushing, run:

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm sanity:validate
```
