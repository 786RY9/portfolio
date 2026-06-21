/**
 * Shape of a single project returned by /api/projects
 */
export type GithubProject = {
  /** GitHub repo name (used as slug/key) */
  slug: string
  /** Zero-padded display index e.g. "01" */
  num: string
  /** Display title — from portfolio.json or repo name */
  title: string
  /** Description — from portfolio.json or repo description */
  description: string
  /** Role / type label e.g. "Full-Stack · Security · ML" */
  role: string
  /** Year string derived from pushed_at */
  year: string
  /** Live demo URL (from portfolio.json) */
  liveUrl?: string
  /** GitHub repo HTML URL — undefined for private repos (not exposed) */
  githubUrl?: string
  /** Whether the repo is private */
  isPrivate: boolean
  /** Top languages by byte count */
  languages: string[]
  /** Star count — 0 for private repos */
  stars: number
  /** Fork count */
  forks: number
  /** ISO date of last push */
  pushedAt: string
  /** Featured flag — from portfolio.json */
  featured: boolean
  /** Sort order — from portfolio.json */
  order: number
  /**
   * Proxied cover image URL via /api/github-asset
   * Always use this URL in <img> or next/image — never construct raw.githubusercontent.com URLs directly
   */
  coverUrl: string
  /** Proxied demo GIF URL */
  demoGifUrl: string
  /** Proxied demo video URL (optional — only present if .portfolio/demo.mp4 exists) */
  demoVideoUrl?: string
}

/** portfolio.json schema (placed in .portfolio/portfolio.json in each repo) */
export type PortfolioMeta = {
  title?: string
  description?: string
  role?: string
  live_url?: string
  featured?: boolean
  order?: number
  has_video?: boolean
}
