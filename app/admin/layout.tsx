import type { Metadata } from "next"
import { AdminNav } from "@/components/admin/AdminNav"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"

export const metadata: Metadata = {
  title: "Admin — RY Portfolio CMS",
  robots: { index: false, follow: false },
}

/**
 * Admin shell layout — auth protection is handled by middleware.ts,
 * so this layout just renders the sidebar + main content area.
 * The /admin/login page is excluded from this layout by the route matcher
 * in middleware.ts, breaking the previous redirect loop.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#080808] text-white">
      <AdminNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
