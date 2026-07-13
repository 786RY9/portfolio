import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession, validateSlug } from "@/lib/auth"
import { listPosts, upsertPost } from "@/lib/cms-github"
import type { PostType, StoredPost } from "@/lib/cms-types"
import slugify from "slugify"

/** GET /api/admin/posts?type=blog — list ALL posts including drafts (admin only) */
export async function GET(req: NextRequest) {
  const check = await requireAdminSession()
  if (!check.ok) return check.response

  const type = (req.nextUrl.searchParams.get("type") ?? "blog") as PostType
  if (type !== "blog" && type !== "learnings") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }

  try {
    const posts = await listPosts(type, true) // include drafts
    return NextResponse.json(posts)
  } catch (err) {
    console.error("[admin/posts GET] Error:", err)
    return NextResponse.json({ error: "Failed to list posts" }, { status: 500 })
  }
}

/** POST /api/admin/posts — create a new post */
export async function POST(req: NextRequest) {
  const check = await requireAdminSession()
  if (!check.ok) return check.response

  let body: {
    type?: PostType
    title?: string
    slug?: string
    excerpt?: string
    tags?: string[]
    draft?: boolean
    content?: Record<string, unknown>[]
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { type, title, excerpt = "", tags = [], draft = true, content = [] } = body

  if (!type || (type !== "blog" && type !== "learnings")) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }
  if (!title || typeof title !== "string" || title.trim().length < 2) {
    return NextResponse.json({ error: "Title is required (min 2 chars)" }, { status: 400 })
  }

  // Auto-generate slug from title if not provided
  let slug =
    body.slug ??
    slugify(title, { lower: true, strict: true, trim: true })
  const safe = validateSlug(slug)
  if (!safe) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
  }

  const now = new Date().toISOString()
  const stored: StoredPost = {
    meta: {
      title: title.trim(),
      excerpt: typeof excerpt === "string" ? excerpt.trim() : "",
      tags: Array.isArray(tags) ? tags.map(String) : [],
      publishedAt: now,
      updatedAt: now,
      draft: Boolean(draft),
      type,
    },
    content,
  }

  try {
    await upsertPost(type, safe, stored)
    return NextResponse.json({ slug: safe }, { status: 201 })
  } catch (err) {
    console.error("[admin/posts POST] Error:", err)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
