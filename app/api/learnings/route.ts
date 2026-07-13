import { NextResponse } from "next/server"
import { listPosts } from "@/lib/cms-github"

export const revalidate = 60

export async function GET() {
  try {
    const posts = await listPosts("learnings", false)
    return NextResponse.json(posts, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    })
  } catch (err) {
    console.error("[api/learnings] Error:", err)
    return NextResponse.json({ error: "Failed to fetch learnings" }, { status: 500 })
  }
}
