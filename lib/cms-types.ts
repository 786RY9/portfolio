/**
 * CMS type definitions — used across public and admin routes.
 * Content is stored as BlockNote JSON in cms-content/ inside the portfolio repo.
 */

/** A single block in a BlockNote document */
export type BlockNoteDocument = Record<string, unknown>[]

/** Supported post types */
export type PostType = "blog" | "learnings"

/** Metadata stored at the top level of post.json — used for listing pages */
export type PostMeta = {
  slug: string
  title: string
  excerpt: string
  /** ISO date string */
  publishedAt: string
  /** ISO date string */
  updatedAt: string
  tags: string[]
  /** Proxied cover image URL via /api/github-asset (or null) */
  coverUrl: string | null
  /** If true, post is hidden from public listing */
  draft: boolean
  type: PostType
}

/** Full post — metadata + BlockNote document content */
export type Post = PostMeta & {
  content: BlockNoteDocument
}

/** A service offered by the portfolio owner */
export type Service = {
  id: string
  title: string
  tagline: string
  description: string
  /** Lucide icon name */
  icon: string
  features: string[]
  /** Featured services appear first / larger on the homepage */
  featured: boolean
  order: number
}

/** Shape of post.json stored in the repo */
export type StoredPost = {
  meta: Omit<PostMeta, "slug" | "coverUrl">
  content: BlockNoteDocument
}
