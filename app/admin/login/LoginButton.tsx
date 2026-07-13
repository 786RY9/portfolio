"use client"

import { signIn } from "next-auth/react"
import { Github } from "lucide-react"
import { useState } from "react"

export default function LoginButton() {
  const [loading, setLoading] = useState(false)

  return (
    <button
      onClick={async () => {
        setLoading(true)
        await signIn("github", { callbackUrl: "/admin" })
      }}
      disabled={loading}
      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3.5 font-semibold text-white transition-all hover:border-white/25 hover:bg-white/[0.1] disabled:opacity-60"
    >
      {/* Shine */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <Github className="h-5 w-5" />
      {loading ? "Connecting…" : "Continue with GitHub"}
    </button>
  )
}
