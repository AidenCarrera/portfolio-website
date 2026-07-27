# Aiden Carrera Portfolio

My personal portfolio for software development and music.
It showcases my projects, released and upcoming music, contact information,
and the tools I use as a musician and audio programmer.

## Features

- Project showcase with topic filtering and GitHub data
- Cassette tape player for listening to upcoming music snippets
- Spotify integrations for listening to released music
- Audio gear & software showcase section grouped by hardware, software, instruments, and plugins
- Contact form using a Next.js API route with Resend delivery, input validation, and per-IP rate limiting
- WCAG-informed accessibility practices, including skip links, keyboard-accessible audio controls, accessible forms, and visible focus states
- Automated sitemap and SEO metadata for search engines

## Stack

- Next.js 16 and React 19
- TypeScript 6
- Tailwind CSS 4
- Motion
- Resend
- Vercel

## Installation and setup

To run the site locally, make sure you have Git, Node.js, and pnpm installed.

```bash
git clone https://github.com/AidenCarrera/portfolio-website.git
cd portfolio-website
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment configuration

Copy [`.env.example`](./.env.example) to `.env.local` and add the credentials needed for the integrations you want to use.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site origin used for canonical URLs and metadata |
| `RESEND_API_KEY` | Sends contact-form submissions through Resend |
| `GITHUB_PAT` | Loads current project data from the GitHub GraphQL API |
| `SPOTIFY_CLIENT_ID` | Authenticates requests for released music data |
| `SPOTIFY_CLIENT_SECRET` | Authenticates requests for released music data |

`RESEND_API_KEY` is required for contact-form delivery. GitHub and Spotify use static fallback data when their credentials are unavailable. The contact endpoint currently applies a fixed in-memory limit of three submissions per IP per minute, so there is no separate rate-limit environment variable.

## Quality checks

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Production build
pnpm build
```
