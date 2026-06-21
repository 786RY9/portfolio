import { NextResponse } from "next/server"

/**
 * GET /api/github-asset?repo=786RY9/reponame&file=.portfolio/cover.jpg
 *
 * Server-side proxy for private GitHub repo raw assets.
 * The GITHUB_TOKEN is injected here and is NEVER sent to the browser.
 * The browser only calls /api/github-asset — it never sees the token.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const repo = searchParams.get("repo")
  const file = searchParams.get("file")

  if (!repo || !file) {
    return new NextResponse("Missing repo or file param", { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return new NextResponse("Server misconfiguration: no GITHUB_TOKEN", { status: 500 })
  }

  // Try main branch first, then master
  const branches = ["main", "master"]
  let assetRes: Response | null = null

  for (const branch of branches) {
    const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${file}`
    const res = await fetch(rawUrl, {
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "portfolio-app",
      },
      // Do not cache the fetch itself — we cache the route response below
      cache: "no-store",
    })
    if (res.ok) {
      assetRes = res
      break
    }
  }

  if (!assetRes) {
    return new NextResponse("Asset not found", { status: 404 })
  }

  const contentType = assetRes.headers.get("content-type") ?? "application/octet-stream"
  const body = await assetRes.arrayBuffer()

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      // Cache in CDN for 1 hour, serve stale up to 24 hours while revalidating
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
