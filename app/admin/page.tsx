import Link from "next/link"
import { listPosts } from "@/lib/cms-github"
import { fetchServices } from "@/lib/cms-github"
import { FileText, BookOpen, Briefcase, PenSquare, ArrowRight } from "lucide-react"

export default async function AdminDashboard() {
  const [blogPosts, learnings, services] = await Promise.all([
    listPosts("blog", true),
    listPosts("learnings", true),
    fetchServices(),
  ])

  const blogDrafts = blogPosts.filter((p) => p.draft).length
  const learningDrafts = learnings.filter((p) => p.draft).length

  const stats = [
    {
      label: "Blog Posts",
      count: blogPosts.length,
      sub: `${blogDrafts} draft${blogDrafts !== 1 ? "s" : ""}`,
      icon: FileText,
      href: "/admin/blog",
      new: "/admin/blog/new",
    },
    {
      label: "Learnings",
      count: learnings.length,
      sub: `${learningDrafts} draft${learningDrafts !== 1 ? "s" : ""}`,
      icon: BookOpen,
      href: "/admin/learnings",
      new: "/admin/learnings/new",
    },
    {
      label: "Services",
      count: services.length,
      sub: "defined services",
      icon: Briefcase,
      href: "/admin/services",
      new: null,
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
          // Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {stats.map(({ label, count, sub, icon: Icon, href, new: newHref }) => (
          <div
            key={label}
            className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05]"
          >
            <div className="mb-4 flex items-center justify-between">
              <Icon className="h-5 w-5 text-[oklch(0.7_0.18_25)]" />
              {newHref && (
                <Link
                  href={newHref}
                  className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40 transition hover:border-[oklch(0.55_0.22_25)]/40 hover:text-[oklch(0.7_0.18_25)]"
                >
                  <PenSquare className="h-3 w-3" />
                  New
                </Link>
              )}
            </div>
            <div className="text-4xl font-black text-white">{count}</div>
            <div className="mt-1 text-sm font-semibold text-white/60">{label}</div>
            <div className="mt-0.5 text-xs text-white/30">{sub}</div>
            <Link
              href={href}
              className="mt-4 flex items-center gap-1 text-xs text-white/30 transition hover:text-white/60"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>

      {/* Recent posts */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
          Recent Blog Posts
        </h2>
        {blogPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 py-10 text-center text-sm text-white/30">
            No posts yet.{" "}
            <Link href="/admin/blog/new" className="text-[oklch(0.7_0.18_25)] hover:underline">
              Write your first post →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {blogPosts.slice(0, 5).map((post) => (
              <Link
                key={post.slug}
                href={`/admin/blog/${post.slug}`}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:border-white/15 hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  {post.draft && (
                    <span className="rounded-full border border-yellow-800/50 bg-yellow-950/40 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-yellow-500/80">
                      Draft
                    </span>
                  )}
                  <span className="text-sm text-white/80">{post.title}</span>
                </div>
                <span className="text-xs text-white/30">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent learnings */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
          Recent Learnings
        </h2>
        {learnings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 py-10 text-center text-sm text-white/30">
            No entries yet.{" "}
            <Link href="/admin/learnings/new" className="text-[oklch(0.7_0.18_25)] hover:underline">
              Log your first learning →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {learnings.slice(0, 5).map((post) => (
              <Link
                key={post.slug}
                href={`/admin/learnings/${post.slug}`}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:border-white/15 hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  {post.draft && (
                    <span className="rounded-full border border-yellow-800/50 bg-yellow-950/40 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-yellow-500/80">
                      Draft
                    </span>
                  )}
                  <span className="text-sm text-white/80">{post.title}</span>
                </div>
                <span className="text-xs text-white/30">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
