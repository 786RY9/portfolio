import type { Metadata } from "next"
import Link from "next/link"
import { listPosts } from "@/lib/cms-github"
import { ArrowRight, Calendar, Tag } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog — Rashid Yaseen",
  description: "Security writeups, technical articles, and tutorials by Rashid Yaseen — covering HTB, pentesting, ML, DevOps, and more.",
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await listPosts("blog", false)

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/[0.06] pb-24 pt-32">
        <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[oklch(0.50_0.20_25)]/[0.05] blur-[160px]" />
        <div className="relative mx-auto max-w-5xl px-6">
          <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">
            <Link href="/" className="transition hover:text-white/70">← Home</Link>
            <span className="h-px w-6 bg-white/20" />
            Blog
          </p>
          <h1 className="font-serif italic font-black text-white" style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.92 }}>
            Articles &<br />
            <span style={{ color: "oklch(0.62 0.24 25)" }}>Writeups</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/50">
            Security research, Hack The Box writeups, tutorials on ML, DevOps, and everything I build or break.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm text-white/30">No articles published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-1"
              >
                {/* Cover */}
                {post.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverUrl}
                    alt={post.title}
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-[oklch(0.15_0.05_25)] to-black">
                    <span className="font-serif italic text-5xl font-black text-white/10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[oklch(0.55_0.22_25)]/30 bg-[oklch(0.55_0.22_25)]/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[oklch(0.7_0.18_25)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="text-lg font-bold text-white leading-snug group-hover:text-white/90">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-white/50">{post.excerpt}</p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="flex items-center gap-1.5 text-xs text-white/30">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-[oklch(0.65_0.22_25)] transition-transform duration-300 group-hover:translate-x-1">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
