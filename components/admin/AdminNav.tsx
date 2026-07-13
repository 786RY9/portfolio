"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Briefcase,
  LogOut,
  PenSquare,
} from "lucide-react"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/learnings", label: "Learnings", icon: BookOpen },
  { href: "/admin/services", label: "Services", icon: Briefcase },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-white/10 bg-[#0a0a0a] px-4 py-6">
      {/* Logo */}
      <Link href="/admin" className="mb-8 flex items-center gap-3">
        <span className="font-serif italic text-2xl text-white">
          RY<span className="text-[oklch(0.65_0.22_25)]">.</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          CMS
        </span>
      </Link>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[oklch(0.55_0.22_25)]/20 text-white border border-[oklch(0.55_0.22_25)]/30"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Quick create */}
      <div className="mb-4 space-y-2">
        <Link
          href="/admin/blog/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[oklch(0.55_0.22_25)]/40 bg-[oklch(0.55_0.22_25)]/10 px-3 py-2 text-xs font-semibold text-[oklch(0.7_0.18_25)] transition-all hover:bg-[oklch(0.55_0.22_25)]/20"
        >
          <PenSquare className="h-3.5 w-3.5" />
          New Post
        </Link>
        <Link
          href="/admin/learnings/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/50 transition-all hover:bg-white/[0.06] hover:text-white"
        >
          <PenSquare className="h-3.5 w-3.5" />
          New Learning
        </Link>
      </div>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/70"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  )
}
