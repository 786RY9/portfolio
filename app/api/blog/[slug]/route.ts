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
    const post = await fetchPost("blog", safe)
    if (!post || post.draft) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(post, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    })
  } catch (err) {
    console.error("[api/blog/slug] Error:", err)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}
