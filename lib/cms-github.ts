/**
 * cms-github.ts — GitHub API backend for the CMS.
 *
 * All CMS content is stored in the portfolio repo under cms-content/:
 *   cms-content/blog/<slug>/post.json
 *   cms-content/blog/<slug>/media/<filename>
 *   cms-content/learnings/<slug>/post.json
 *   cms-content/learnings/<slug>/media/<filename>
 *   cms-content/services.json
 *
 * Reads use the GitHub Contents API (no token needed for public, token for private).
 * Writes commit directly via the Contents API (requires GITHUB_TOKEN with repo scope).
 */

import type { Post, PostMeta, PostType, Service, StoredPost } from "./cms-types"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? ""
const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "786RY9"
// CMS content lives inside the portfolio repo itself
const CMS_REPO = `${GITHUB_USERNAME}/ry_portfolio`
const CMS_BASE = "cms-content"
const BRANCHES = ["main", "master"]

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function ghHeaders() {
  return {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "ry-portfolio-cms",
    "X-GitHub-Api-Version": "2022-11-28",
  }
}

/** Sanitize a slug so it can only be used safely in file paths */
export function sanitizeSlug(slug: string): string {
  return slug.replace(/[^a-z0-9-]/g, "")
}

/** Detect which branch the repo uses (main vs master) */
let _branch: string | null = null
async function getDefaultBranch(): Promise<string> {
  if (_branch) return _branch
  for (const b of BRANCHES) {
    const res = await fetch(
      `https://api.github.com/repos/${CMS_REPO}/branches/${b}`,
      { headers: ghHeaders(), cache: "no-store" }
    )
    if (res.ok) { _branch = b; return b }
  }
  _branch = "main"
  return "main"
}

/** GET a file from the repo. Returns null if not found. */
async function getFile(path: string): Promise<{ content: string; sha: string } | null> {
  const branch = await getDefaultBranch()
  const res = await fetch(
    `https://api.github.com/repos/${CMS_REPO}/contents/${path}?ref=${branch}`,
    { headers: ghHeaders(), cache: "no-store" }
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub GET ${path} failed: ${res.status}`)
  const data = await res.json()
  return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha }
}

/** PUT (create or update) a file in the repo via a commit */
async function putFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  const branch = await getDefaultBranch()
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
    branch,
  }
  if (sha) body.sha = sha
  const res = await fetch(
    `https://api.github.com/repos/${CMS_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: { ...ghHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub PUT ${path} failed: ${res.status} — ${err}`)
  }
}

/** PUT a binary file (base64-encoded) */
async function putBinaryFile(
  path: string,
  base64Content: string,
  message: string,
  sha?: string
): Promise<void> {
  const branch = await getDefaultBranch()
  const body: Record<string, unknown> = {
    message,
    content: base64Content,
    branch,
  }
  if (sha) body.sha = sha
  const res = await fetch(
    `https://api.github.com/repos/${CMS_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: { ...ghHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub PUT binary ${path} failed: ${res.status} — ${err}`)
  }
}

/** DELETE a file from the repo */
async function deleteFile(path: string, message: string): Promise<void> {
  const branch = await getDefaultBranch()
  // Must get the current SHA first
  const file = await getFile(path)
  if (!file) return // already gone
  const res = await fetch(
    `https://api.github.com/repos/${CMS_REPO}/contents/${path}`,
    {
      method: "DELETE",
      headers: { ...ghHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ message, sha: file.sha, branch }),
    }
  )
  if (!res.ok && res.status !== 404) {
    throw new Error(`GitHub DELETE ${path} failed: ${res.status}`)
  }
}

/** List files/dirs at a given path. Returns [] if not found. */
async function listContents(path: string): Promise<{ name: string; type: "file" | "dir"; sha: string }[]> {
  const branch = await getDefaultBranch()
  const res = await fetch(
    `https://api.github.com/repos/${CMS_REPO}/contents/${path}?ref=${branch}`,
    { headers: ghHeaders(), cache: "no-store" }
  )
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`GitHub LIST ${path} failed: ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

/** Build a proxied URL for a CMS media file */
function cmsAssetUrl(repoPath: string): string {
  return `/api/github-asset?repo=${encodeURIComponent(CMS_REPO)}&file=${encodeURIComponent(repoPath)}`
}

// ─────────────────────────────────────────────────────────────────────────────
// Public read operations
// ─────────────────────────────────────────────────────────────────────────────

/** List all posts of a given type. Pass `includeDrafts=true` for admin. */
export async function listPosts(
  type: PostType,
  includeDrafts = false
): Promise<PostMeta[]> {
  const dir = `${CMS_BASE}/${type}`
  const slugDirs = await listContents(dir)
  const posts: PostMeta[] = []

  await Promise.all(
    slugDirs
      .filter((e) => e.type === "dir")
      .map(async (entry) => {
        const slug = sanitizeSlug(entry.name)
        if (!slug) return
        const file = await getFile(`${dir}/${slug}/post.json`)
        if (!file) return
        try {
          const stored: StoredPost = JSON.parse(file.content)
          if (!includeDrafts && stored.meta.draft) return
          const coverPath = `${dir}/${slug}/cover.jpg`
          const coverExists = await getFile(coverPath)
          posts.push({
            slug,
            type,
            ...stored.meta,
            coverUrl: coverExists ? cmsAssetUrl(coverPath) : null,
          })
        } catch {
          // malformed post.json — skip silently
        }
      })
  )

  // Sort by publishedAt descending
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

/** Fetch a single post by slug */
export async function fetchPost(type: PostType, slug: string): Promise<Post | null> {
  const safe = sanitizeSlug(slug)
  if (!safe) return null
  const dir = `${CMS_BASE}/${type}/${safe}`
  const file = await getFile(`${dir}/post.json`)
  if (!file) return null
  try {
    const stored: StoredPost = JSON.parse(file.content)
    const coverPath = `${dir}/cover.jpg`
    const coverExists = await getFile(coverPath)
    return {
      slug: safe,
      type,
      ...stored.meta,
      coverUrl: coverExists ? cmsAssetUrl(coverPath) : null,
      content: stored.content,
    }
  } catch {
    return null
  }
}

/** Fetch services list */
export async function fetchServices(): Promise<Service[]> {
  const file = await getFile(`${CMS_BASE}/services.json`)
  if (!file) return []
  try {
    return JSON.parse(file.content) as Service[]
  } catch {
    return []
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin write operations (only called from protected API routes)
// ─────────────────────────────────────────────────────────────────────────────

/** Create or update a post */
export async function upsertPost(
  type: PostType,
  slug: string,
  data: StoredPost
): Promise<void> {
  const safe = sanitizeSlug(slug)
  if (!safe) throw new Error("Invalid slug")
  const path = `${CMS_BASE}/${type}/${safe}/post.json`
  const existing = await getFile(path)
  await putFile(
    path,
    JSON.stringify(data, null, 2),
    `cms: ${existing ? "update" : "create"} ${type}/${safe}`,
    existing?.sha
  )
}

/** Upload a media file (binary, base64-encoded) for a post */
export async function uploadMedia(
  type: PostType,
  slug: string,
  filename: string,
  base64: string
): Promise<string> {
  const safe = sanitizeSlug(slug)
  if (!safe) throw new Error("Invalid slug")
  // Sanitize filename: only allow safe chars
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
  const path = `${CMS_BASE}/${type}/${safe}/media/${safeFilename}`
  const existing = await getFile(path)
  await putBinaryFile(
    path,
    base64,
    `cms: upload media ${type}/${safe}/${safeFilename}`,
    existing?.sha
  )
  return cmsAssetUrl(path)
}

/** Upload a cover image for a post */
export async function uploadCover(
  type: PostType,
  slug: string,
  base64: string,
  ext: string
): Promise<string> {
  const safe = sanitizeSlug(slug)
  if (!safe) throw new Error("Invalid slug")
  const safeExt = ext.replace(/[^a-z]/g, "")
  const path = `${CMS_BASE}/${type}/${safe}/cover.${safeExt}`
  const existing = await getFile(path)
  await putBinaryFile(
    path,
    base64,
    `cms: upload cover ${type}/${safe}`,
    existing?.sha
  )
  return cmsAssetUrl(path)
}

/** Delete a post and all its media */
export async function deletePost(type: PostType, slug: string): Promise<void> {
  const safe = sanitizeSlug(slug)
  if (!safe) throw new Error("Invalid slug")
  const dir = `${CMS_BASE}/${type}/${safe}`
  // Delete post.json
  await deleteFile(`${dir}/post.json`, `cms: delete ${type}/${safe}`)
  // Delete cover if present
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    await deleteFile(`${dir}/cover.${ext}`, `cms: delete cover ${type}/${safe}`)
  }
  // Delete media files
  const mediaFiles = await listContents(`${dir}/media`)
  await Promise.all(
    mediaFiles.map((f) =>
      deleteFile(`${dir}/media/${f.name}`, `cms: delete media ${type}/${safe}/${f.name}`)
    )
  )
}

/** Update services.json */
export async function updateServices(services: Service[]): Promise<void> {
  const path = `${CMS_BASE}/services.json`
  const existing = await getFile(path)
  await putFile(
    path,
    JSON.stringify(services, null, 2),
    "cms: update services",
    existing?.sha
  )
}
