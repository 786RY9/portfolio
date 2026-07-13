/**
 * /admin/login — GitHub OAuth sign-in page.
 * If already authenticated, redirects to /admin.
 *
 * SETUP REQUIRED (one time):
 * 1. Go to: https://github.com/settings/developers → "OAuth Apps" → "New OAuth App"
 * 2. Application name: "RY Portfolio CMS"
 * 3. Homepage URL: http://localhost:3000 (or your Vercel URL)
 * 4. Authorization callback URL: http://localhost:3000/api/auth/callback/github
 *    (For Vercel: https://your-domain.vercel.app/api/auth/callback/github)
 * 5. Add to .env.local:
 *    GITHUB_CLIENT_ID=<your client id>
 *    GITHUB_CLIENT_SECRET=<your client secret>
 *    NEXTAUTH_SECRET=<run: openssl rand -base64 32>
 *    NEXTAUTH_URL=http://localhost:3000
 *    ADMIN_GITHUB_USERNAME=786RY9
 */
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import LoginButton from "./LoginButton"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await auth()
  const login = (session?.user as { githubLogin?: string } | null)?.githubLogin
  const ADMIN = process.env.ADMIN_GITHUB_USERNAME ?? "786RY9"

  // Already logged in as owner
  if (session && login === ADMIN) redirect("/admin")

  const { error } = await searchParams

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-black text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.50_0.20_25)]/[0.06] blur-[160px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="font-serif italic text-4xl text-white">
            RY<span className="text-[oklch(0.65_0.22_25)]">.</span>
          </span>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
            Portfolio CMS
          </p>
        </div>

        <h1 className="mb-2 text-center text-lg font-bold text-white">
          Admin Sign In
        </h1>
        <p className="mb-8 text-center text-sm text-white/40">
          Only the portfolio owner can log in.
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-900/40 bg-red-950/30 px-4 py-3 text-center text-sm text-red-400">
            {error === "AccessDenied"
              ? "Access denied. Only the portfolio owner can log in."
              : "Authentication failed. Please try again."}
          </div>
        )}

        <LoginButton />

        <p className="mt-6 text-center text-[11px] text-white/20">
          Authenticated via GitHub OAuth · Session expires in 24h
        </p>
      </div>
    </div>
  )
}
