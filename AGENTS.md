# AGENTS.md

## Project Overview

Personal developer portfolio site (Next.js 16, React 19, Tailwind CSS 4, TypeScript). Single-page app that pulls GitHub repos dynamically via API routes.

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm lint` — ESLint (no typecheck script; `next.config.mjs` has `ignoreBuildErrors: true`)

## Environment

Copy `.env.example` to `.env.local` and fill in:
- `GITHUB_TOKEN` — PAT with `repo` scope (reads `.portfolio/` folders from private repos)
- `GITHUB_USERNAME` — default: `786RY9`

Without valid tokens, the GitHub sections will fail at runtime.

## Architecture

- `app/page.tsx` — single-page layout, all sections rendered client-side
- `app/api/projects/route.ts` — fetches repos, merges with `.portfolio/portfolio.json` metadata from each repo
- `app/api/github-asset/route.ts` — proxies raw GitHub assets (images, GIFs) so private repo assets work
- `lib/github.ts` — `GithubProject` and `PortfolioMeta` types
- `components/` — section components (hero, projects, skills, etc.) and shadcn/ui primitives in `components/ui/`

## Conventions

- **No tests configured.** No test script or test framework present.
- **No typecheck script.** TS errors are ignored at build time (`ignoreBuildErrors: true`).
- **Tailwind CSS 4** with `@tailwindcss/postcss` plugin (not v3 config).
- **Fonts:** Inter (sans) and Playfair Display (serif) via `next/font/google`.
- **Image proxying:** Use `/api/github-asset?url=...` for all GitHub-hosted images; never construct raw.githubusercontent.com URLs directly.
- Path alias `@/*` maps to project root.
