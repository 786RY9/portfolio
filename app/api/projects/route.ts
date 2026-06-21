import { NextResponse } from "next/server"
import type { GithubProject, PortfolioMeta } from "@/lib/github"

// ISR: revalidate this route's cached response every 1 hour
export const revalidate = 3600

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "786RY9"
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? ""
const PORTFOLIO_TOPIC = "portfolio"

/** Shared fetch headers using the PAT — token never leaves the server */
function ghHeaders() {
  return {
    Authorization: `token ${GITHUB_TOKEN}`,
    // Include mercy-preview so GitHub returns the `topics` array on repos
    Accept: "application/vnd.github.mercy-preview+json",
    "User-Agent": "portfolio-app",
    "X-GitHub-Api-Version": "2022-11-28",
  }
}

/** Fetch all repos (public + private) for the authenticated user */
async function fetchAllRepos() {
  const allRepos: any[] = []
  let page = 1
  while (true) {
    // NOTE: `visibility=all` is the correct way to get both public + private repos.
    // Do NOT combine with `type` or `affiliation` — GitHub returns a 422 error.
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}&visibility=all&sort=pushed`,
      { headers: ghHeaders(), cache: "no-store" }
    )
    if (!res.ok) {
      console.error("[projects API] GitHub repos fetch failed:", res.status, await res.text())
      break
    }
    const batch = await res.json()
    if (!Array.isArray(batch) || batch.length === 0) break
    allRepos.push(...batch)
    if (batch.length < 100) break
    page++
  }
  return allRepos
}

/** Fetch language breakdown for a single repo */
async function fetchLanguages(repoFullName: string): Promise<string[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repoFullName}/languages`, {
      headers: ghHeaders(),
      cache: "no-store",
    })
    if (!res.ok) return []
    const data: Record<string, number> = await res.json()
    // Sort by byte count, take top 5
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang)
  } catch {
    return []
  }
}

/**
 * Fetch portfolio.json from .portfolio/ in the repo.
 * Returns the meta AND a `found` flag so we know whether
 * to fall back to GitHub-generated assets.
 */
async function fetchPortfolioMeta(
  repoFullName: string
): Promise<{ meta: PortfolioMeta; found: boolean }> {
  const branches = ["main", "master"]
  for (const branch of branches) {
    try {
      const url = `https://raw.githubusercontent.com/${repoFullName}/${branch}/.portfolio/portfolio.json`
      const res = await fetch(url, { headers: ghHeaders(), cache: "no-store" })
      if (res.ok) {
        return { meta: await res.json(), found: true }
      }
    } catch {
      // try next branch
    }
  }
  // .portfolio/ folder not found — we'll use GitHub fallbacks
  return { meta: {}, found: false }
}

/** Build the proxied asset URL via our secure /api/github-asset route */
function assetUrl(repoFullName: string, file: string) {
  return `/api/github-asset?repo=${encodeURIComponent(repoFullName)}&file=${encodeURIComponent(file)}`
}

/**
 * GitHub automatically generates an OpenGraph social card for every repo.
 * This is publicly accessible — no token required — and shows the repo
 * name, description, star count, etc. on a nice dark card.
 * Format: https://opengraph.githubassets.com/1/{owner}/{repo}
 */
function githubOgImage(repoFullName: string) {
  return `https://opengraph.githubassets.com/1/${repoFullName}`
}

/** Convert a repo name like 'my-cool-project' → 'My Cool Project' */
function repoNameToTitle(name: string) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Generate a fallback description when the repo has no portfolio.json.
 * Uses the GitHub repo description if available, otherwise a generic line.
 */
function fallbackDescription(repoDesc: string | null, languages: string[], repoName: string): string {
  if (repoDesc && repoDesc.trim().length > 10) return repoDesc.trim()
  const stack = languages.slice(0, 3).join(", ")
  const title = repoNameToTitle(repoName)
  if (stack) return `${title} — a project built with ${stack}.`
  return `${title} — a development project by Rashid Yaseen.`
}

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not configured" },
      { status: 500 }
    )
  }

  // 1. Fetch all repos
  const allRepos = await fetchAllRepos()

  // 2. Filter: only repos with the 'portfolio' topic
  //    This covers BOTH the curation strategy AND the "hide public repos" requirement:
  //    - Public repos WITHOUT the 'portfolio' topic are silently excluded
  //    - Private repos WITHOUT the topic are also excluded
  //    - Only repos explicitly opted-in with the topic appear
  const portfolioRepos = allRepos.filter((repo: any) =>
    Array.isArray(repo.topics) && repo.topics.includes(PORTFOLIO_TOPIC)
  )

  // 3. Enrich each repo in parallel
  const projects: GithubProject[] = await Promise.all(
    portfolioRepos.map(async (repo: any, i: number) => {
      const [languages, { meta, found: hasPortfolioFolder }] = await Promise.all([
        fetchLanguages(repo.full_name),
        fetchPortfolioMeta(repo.full_name),
      ])

      const pushedAt = repo.pushed_at ?? repo.updated_at ?? ""
      const year = pushedAt ? new Date(pushedAt).getFullYear().toString() : "—"

      // ── Cover & demo asset resolution ──────────────────────────────────
      // If the repo HAS a .portfolio/ folder → serve assets through our
      // secure proxy (supports private repos).
      // If NOT → use GitHub's auto-generated OG image as a graceful fallback
      // (publicly accessible, no token needed, looks great out of the box).
      const ogImage = githubOgImage(repo.full_name)
      const coverUrl = hasPortfolioFolder
        ? assetUrl(repo.full_name, ".portfolio/cover.jpg")
        : ogImage
      const demoGifUrl = hasPortfolioFolder
        ? assetUrl(repo.full_name, ".portfolio/demo.gif")
        : ogImage
      const demoVideoUrl =
        hasPortfolioFolder && meta.has_video
          ? assetUrl(repo.full_name, ".portfolio/demo.mp4")
          : undefined

      return {
        slug: repo.name,
        num: String(i + 1).padStart(2, "0"),
        title: meta.title ?? repoNameToTitle(repo.name),
        description:
          meta.description ??
          fallbackDescription(repo.description, languages, repo.name),
        role: (meta.role ?? languages.slice(0, 3).join(" · ")) || "Project",
        year,
        liveUrl: meta.live_url,
        // Only expose GitHub URL for public repos
        githubUrl: repo.private ? undefined : repo.html_url,
        isPrivate: repo.private,
        languages,
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        pushedAt,
        featured: meta.featured ?? false,
        order: meta.order ?? 999,
        coverUrl,
        demoGifUrl,
        demoVideoUrl,
      } satisfies GithubProject
    })
  )

  // 4. Sort: featured first, then by order, then by pushed_at (most recent first)
  projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.order !== b.order) return a.order - b.order
    return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
  })

  // 5. Re-assign sequential numbers after sorting
  projects.forEach((p, i) => {
    p.num = String(i + 1).padStart(2, "0")
  })

  return NextResponse.json(projects, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
