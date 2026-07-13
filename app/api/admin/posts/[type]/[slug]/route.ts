import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession, validateSlug } from "@/lib/auth"
import { fetchPost, upsertPost, deletePost } from "@/lib/cms-github"
import type { PostType, StoredPost } from "@/lib/cms-types"

type Params = { params: Promise<{ type: string; slug: string }> }

/** GET /api/admin/posts/[type]/[slug] — fetch any post (including drafts) */
export async function GET(_req: NextRequest, { params }: Params) {
  const check = await requireAdminSession()
  if (!check.ok) return check.response

  const { type, slug } = await params
  if (type !== "blog" && type !== "learnings") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }
  const safe = validateSlug(slug)
  if (!safe) return NextResponse.json({ error: "Invalid slug" }, { status: 400 })

  try {
    const post = await fetchPost(type as PostType, safe)
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(post)
  } catch (err) {
    console.error("[admin/posts/[type]/[slug] GET] Error:", err)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

/** PUT /api/admin/posts/[type]/[slug] — update post content and/or metadata */
export async function PUT(req: NextRequest, { params }: Params) {
  const check = await requireAdminSession()
  if (!check.ok) return check.response

  const { type, slug } = await params
  if (type !== "blog" && type !== "learnings") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }
  const safe = validateSlug(slug)
  if (!safe) return NextResponse.json({ error: "Invalid slug" }, { status: 400 })

  let body: {
    title?: string
    excerpt?: string
    tags?: string[]
    draft?: boolean
    content?: Record<string, unknown>[]
    publishedAt?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  try {
    // Fetch existing post to merge (preserve fields not being updated)
    const existing = await fetchPost(type as PostType, safe)
    const now = new Date().toISOString()

    const stored: StoredPost = {
      meta: {
        title: body.title?.trim() ?? existing?.title ?? "",
        excerpt: body.excerpt?.trim() ?? existing?.excerpt ?? "",
        tags: Array.isArray(body.tags) ? body.tags.map(String) : (existing?.tags ?? []),
        publishedAt: body.publishedAt ?? existing?.publishedAt ?? now,
        updatedAt: now,
        draft: body.draft !== undefined ? Boolean(body.draft) : (existing?.draft ?? true),
        type: type as PostType,
      },
      content: body.content ?? existing?.content ?? [],
    }

    await upsertPost(type as PostType, safe, stored)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[admin/posts/[type]/[slug] PUT] Error:", err)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

/** DELETE /api/admin/posts/[type]/[slug] — delete a post and all its media */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const check = await requireAdminSession()
  if (!check.ok) return check.response

  const { type, slug } = await params
  if (type !== "blog" && type !== "learnings") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }
  const safe = validateSlug(slug)
  if (!safe) return NextResponse.json({ error: "Invalid slug" }, { status: 400 })

  try {
    await deletePost(type as PostType, safe)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[admin/posts/[type]/[slug] DELETE] Error:", err)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
