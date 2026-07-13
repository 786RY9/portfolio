import { NextResponse } from "next/server"
import { fetchPost } from "@/lib/cms-github"
import { validateSlug } from "@/lib/auth"

export const revalidate = 60

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const safe = validateSlug(slug)
  if (!safe) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
  }
  try {
    const post = await fetchPost("learnings", safe)
    if (!post || post.draft) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (err) {
    console.error("[api/learnings/slug] Error:", err)
    return NextResponse.json({ error: "Failed to fetch learning" }, { status: 500 })
  }
}
