# Portfolio Website

My personal portfolio for software development and music.
It showcases my projects, released music, contact information,
and the tools I use as a musician and audio programmer.

## Features

- Project showcase with topic filtering and GitHub data
- GitHub-backed project detail routes with optional Sanity enrichment
- Cassette tape player for listening to Sanity-hosted music snippets
- Spotify integrations for listening to released music
- Audio gear & software showcase section grouped by hardware, software, instruments, and plugins
- Standalone Sanity-hosted Studio for portfolio content and media
- Contact form using a Next.js API route with Resend delivery, input validation, and per-IP rate limiting
- WCAG-informed accessibility practices, including skip links, keyboard-accessible audio controls, accessible forms, and visible focus states
- Automated sitemap and SEO metadata for search engines

## Stack

- Next.js 16 and React 19
- TypeScript 6
- Tailwind CSS 4
- Motion
- Resend
- Sanity
- Vercel

## Installation and setup

To run the site locally, make sure you have Git, Node.js, and pnpm installed.
Fork the repository, then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/portfolio-website.git
cd portfolio-website
pnpm install
cp .env.example .env.local
```

Create your own Sanity project and dataset, then add their values to
`.env.local`. This repository intentionally contains no fallback Sanity project
ID, dataset, or deployed Studio app ID. A build will stop with a clear error
until your Sanity values are present.

After the required values are configured:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The Studio is deployed separately through Sanity:

```bash
pnpm sanity:deploy
```

The first deployment creates a Sanity-hosted Studio application and provides
its `*.sanity.studio` URL. Add the assigned application ID to
`SANITY_STUDIO_APP_ID` for later deployments. To develop the Studio locally
with live reloading, run `pnpm sanity:dev` and open
[http://localhost:3333](http://localhost:3333).

## Environment configuration

Copy [`.env.example`](./.env.example) to `.env.local` and add only your own
credentials and account identifiers. Never commit `.env.local`.

| Variable                        | Required for       | Purpose                                                        |
| ------------------------------- | ------------------ | -------------------------------------------------------------- |
| `SITE_URL`                      | Deployment         | Server-only canonical origin used for URLs and metadata        |
| `SANITY_STUDIO_PROJECT_ID`      | Site and Studio    | Your Sanity project ID                                         |
| `SANITY_STUDIO_DATASET`         | Site and Studio    | Your Sanity dataset name                                       |
| `SANITY_STUDIO_APP_ID`          | Hosted Studio      | Existing Sanity application to update on later deployments     |
| `SANITY_DISABLED`               | Outage testing     | Set to `true` to exercise the Sanity outage behavior            |
| `GITHUB_PAT`                    | GitHub projects    | Authenticates GitHub GraphQL requests                          |
| `GITHUB_USERNAME`               | GitHub projects    | Selects the GitHub account and builds its public profile link  |
| `SPOTIFY_CLIENT_ID`             | Spotify releases   | Authenticates Spotify API requests                             |
| `SPOTIFY_CLIENT_SECRET`         | Spotify releases   | Authenticates Spotify API requests                             |
| `SPOTIFY_ARTIST_ID`             | Spotify releases   | Selects the artist whose releases are displayed                |
| `RESEND_API_KEY`                | Contact form       | Authenticates email delivery through your Resend account       |
| `RESEND_FROM_EMAIL`             | Contact form       | Verified sender accepted by your Resend account                |
| `CONTACT_EMAIL`                 | Contact fallback   | Recipient used until a Profile email exists in your Sanity data |
| `LINKEDIN_URL`                  | Optional link      | Public LinkedIn profile URL                                    |
| `INSTAGRAM_URL`                 | Optional link      | Public Instagram profile URL                                   |
| `YOUTUBE_URL`                   | Optional link      | Public YouTube channel URL                                     |

Sanity is the only required content integration. GitHub, Spotify, contact-form,
and social-link features stay empty or disabled until their complete
configuration is supplied; they never fall back to the original author's
accounts or data.

During a Sanity outage, the homepage uses the profile defaults in
`src/lib/profile.ts` and projects use GitHub data without Sanity enrichment.
Resume files, music snippets, and gear are unavailable. Set
`SANITY_DISABLED=true` in a local process to test this path without changing
the configured Sanity project.

All three Resend values are required to enable contact-form delivery:
`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and either `CONTACT_EMAIL` or an email in
the Sanity `Profile` document. The contact endpoint applies a fixed in-memory
limit of three submissions per IP per minute.

The Sanity project ID and dataset are public identifiers, not secrets. No Sanity
write token is used by the website. Studio users authenticate directly with
Sanity. If Studio is opened from a new domain, add that origin to the Sanity
project CORS settings with credentials enabled.

The website reads Sanity only from server-rendered code, so the project and
dataset do not need Next.js public-variable aliases. After the first hosted
Studio deployment, keep the assigned application ID in
`SANITY_STUDIO_APP_ID` locally and in deployment automation; forks should
supply their own application ID.

## Content architecture

GitHub remains the source of truth for discovered repositories, repository
names, descriptions, topics, links, ownership, and creation dates. Sanity
`Projects` documents match a repository using its exact `owner/repository`
identity and only add presentation content such as optional repository-name and
card-description overwrites, optional topic/tag overwrites, images, detail-page
copy, highlights, and display order.

Project cards and detail pages use a Sanity card description when present and
otherwise retain the GitHub description. The curated sort uses Sanity display
order when supplied, and resolved positions 1–3 are marked Featured
automatically; Newest and Name remain GitHub-driven. Each card links to its
project detail route while keeping the GitHub and live-site buttons as separate
external actions.

The Projects listing and detail routes at `/projects/[slug]` combine GitHub data
with an optional matching Sanity document and continue to work with GitHub data
alone when Sanity has no matching project documents.

The Studio schemas are:

- `Profile`
- `Projects`
- `Music`
- `Gear Item`

`Profile` is a single document containing the site name, email, an optional
Sanity-hosted resume PDF, About Me copy, landing text, and slogan. Those fields
populate the homepage,
navigation, footer, metadata, direct contact details, contact-form recipient,
structured data, and the conditional resume download.

`Music` contains a name and a Sanity-hosted audio file. Published entries feed
the cassette player in creation order. No audio preview files are stored in
this repository.

`Gear Item` documents are the source of truth for the gear showcase. Each item
has a top-level type, optional category and manufacturer, and a numeric sort
order. Instrument and mixing plugins are grouped by category on the page.

## Sanity and Vercel

The Sanity client, queries, schemas, and typed data helpers live under
`src/sanity`. Published reads run in Server Components through the Sanity CDN
and the Next.js data cache with a one-hour revalidation interval. Normal page
loads do not use a write token or an uncached Sanity request.

For Vercel, copy the website's required and optional values from `.env.local`
into each deployment environment. `SANITY_STUDIO_PROJECT_ID` and
`SANITY_STUDIO_DATASET` are required by the website; the application ID is only
needed wherever `pnpm sanity:deploy` runs. The Studio is deployed independently
to Sanity hosting and is not served from the Next.js application.

## Quality checks

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Sanity schema validation
pnpm sanity:validate

# Standalone Studio build
pnpm sanity:build

# Production build
pnpm build
```
