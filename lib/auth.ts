/**
 * auth.ts — Server-side auth helpers using NextAuth v5.
 *
 * GitHub OAuth is configured so ONLY the portfolio owner (ADMIN_GITHUB_USERNAME)
 * can successfully log in. All other GitHub accounts are rejected with 403.
 *
 * Setup steps (one-time):
 * 1. Go to https://github.com/settings/developers → OAuth Apps → New OAuth App
 * 2. Application name: "RY Portfolio CMS"
 * 3. Homepage URL: https://your-domain.com  (or http://localhost:3000 for dev)
 * 4. Authorization callback URL: https://your-domain.com/api/auth/callback/github
 * 5. Copy Client ID and Client Secret into .env.local
 */

import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { NextRequest, NextResponse } from "next/server"

const ADMIN_GITHUB_USERNAME = process.env.ADMIN_GITHUB_USERNAME ?? "786RY9"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // Request login:read scope so we can access the GitHub username
      authorization: { params: { scope: "read:user" } },
    }),
  ],
  callbacks: {
    /**
     * signIn callback — called immediately after GitHub returns the user profile.
     * Returning false rejects the login attempt entirely.
     */
    async signIn({ profile }) {
      const login = (profile as { login?: string })?.login
      if (!login) return false
      // Strict allowlist: only the owner can log in
      return login === ADMIN_GITHUB_USERNAME
    },
    /**
     * jwt callback — runs whenever a JWT is created or updated.
     * We embed the GitHub login name so we can re-check it in API routes.
     */
    async jwt({ token, profile }) {
      if (profile) {
        token.githubLogin = (profile as { login?: string })?.login
      }
      return token
    },
    /**
     * session callback — exposes the GitHub login on the client-facing session.
     */
    async session({ session, token }) {
      if (token.githubLogin) {
        ;(session.user as { githubLogin?: string }).githubLogin = token.githubLogin as string
      }
      return session
    },
  },
  pages: {
    // Custom sign-in page
    signIn: "/admin/login",
    // Redirect here on error (e.g. unauthorized GitHub account)
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    // Sessions expire after 24 hours
    maxAge: 24 * 60 * 60,
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// Helpers for API route protection
// ─────────────────────────────────────────────────────────────────────────────

/** Call this at the top of any admin API route to verify the session. */
export async function requireAdminSession(): Promise<
  { ok: true } | { ok: false; response: NextResponse }
> {
  const session = await auth()
  const login = (session?.user as { githubLogin?: string } | null)?.githubLogin
  if (!session || login !== ADMIN_GITHUB_USERNAME) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }
  return { ok: true }
}

/** Validate and sanitize a slug. Returns null if invalid. */
export function validateSlug(slug: unknown): string | null {
  if (typeof slug !== "string") return null
  const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, "")
  return clean.length > 0 && clean.length <= 120 ? clean : null
}
