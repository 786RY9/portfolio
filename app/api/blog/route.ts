import { NextResponse } from "next/server"
import { listPosts } from "@/lib/cms-github"

export const revalidate = 60 // ISR: revalidate every 60 seconds

export async function GET() {
  try {
    const posts = await listPosts("blog", false)
    return NextResponse.json(posts, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    })
  } catch (err) {
    console.error("[api/blog] Error:", err)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
