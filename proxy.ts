import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN = process.env.ADMIN_GITHUB_USERNAME ?? "786RY9"

/**
 * Next.js 16 proxy (replaces middleware.ts).
 * Protects all /admin/* routes except /admin/login using JWT token check.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /admin routes EXCEPT the login page itself
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    const isAuthorized = token?.githubLogin === ADMIN

    if (!isAuthorized) {
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
