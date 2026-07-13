import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminNav } from "@/components/admin/AdminNav"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"

export const metadata: Metadata = {
  title: "Admin — RY Portfolio CMS",
  robots: { index: false, follow: false }, // Never index admin pages
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const login = (session?.user as { githubLogin?: string } | null)?.githubLogin
  const ADMIN = process.env.ADMIN_GITHUB_USERNAME ?? "786RY9"

  // Redirect to login if not authenticated as the owner
  if (!session || login !== ADMIN) {
    redirect("/admin/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808] text-white">
      <AdminNav />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
