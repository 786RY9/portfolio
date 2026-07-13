import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { fetchPost, listPosts } from "@/lib/cms-github"
import { PostRendererWrapper } from "@/components/PostRendererClient"
import { Calendar, ArrowLeft, Tag } from "lucide-react"
import type { PartialBlock } from "@blocknote/core"

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await listPosts("blog", false)
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPost("blog", slug)
  if (!post || post.draft) return { title: "Post Not Found" }
  return {
    title: `${post.title} — Rashid Yaseen`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.coverUrl ? { images: [post.coverUrl] } : {}),
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetchPost("blog", slug)
  if (!post || post.draft) notFound()

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Cover image */}
      {post.coverUrl && (
        <div className="relative h-[40vh] max-h-[480px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverUrl}
            alt={post.title}
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
        </div>
      )}

      <article className={`mx-auto max-w-3xl px-6 ${post.coverUrl ? "-mt-20 pt-0" : "pt-32"} pb-24`}>
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 transition hover:text-white/70"
        >
          <ArrowLeft className="h-3 w-3" /> Blog
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-full border border-[oklch(0.55_0.22_25)]/30 bg-[oklch(0.55_0.22_25)]/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[oklch(0.7_0.18_25)]"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="mb-4 font-serif italic font-black text-white leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mb-8 flex items-center gap-4 border-b border-white/[0.06] pb-8 text-xs text-white/30">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </span>
          {post.updatedAt !== post.publishedAt && (
            <span className="text-white/20">
              Updated {new Date(post.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-8 text-lg leading-relaxed text-white/60 italic border-l-2 border-[oklch(0.55_0.22_25)]/50 pl-5">
            {post.excerpt}
          </p>
        )}

        {/* BlockNote content */}
        <div className="prose-dark">
          <PostRendererWrapper content={post.content as PartialBlock[]} />
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-white/[0.06] pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[oklch(0.65_0.22_25)] transition hover:text-[oklch(0.75_0.18_25)]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all posts
          </Link>
        </div>
      </article>

      <style>{`
        .prose-dark .bn-editor { background: transparent !important; }
        .prose-dark .bn-editor [contenteditable] { padding: 0; cursor: default; }
        .prose-dark h1, .prose-dark h2, .prose-dark h3 { color: white; font-weight: 700; margin: 1.5em 0 0.5em; }
        .prose-dark p { color: rgba(255,255,255,0.75); line-height: 1.75; margin: 0.75em 0; }
        .prose-dark strong { color: white; }
        .prose-dark em { color: rgba(255,255,255,0.85); }
        .prose-dark code { background: rgba(255,255,255,0.07); border-radius: 4px; padding: 2px 6px; font-size: 0.875em; color: oklch(0.75 0.18 25); }
        .prose-dark pre { background: #0d0d0d; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.25rem; overflow-x: auto; }
        .prose-dark pre code { background: none; padding: 0; color: rgba(255,255,255,0.85); }
        .prose-dark blockquote { border-left: 2px solid oklch(0.55 0.22 25 / 0.5); padding-left: 1.25rem; color: rgba(255,255,255,0.55); font-style: italic; }
        .prose-dark a { color: oklch(0.7 0.18 25); text-decoration: underline; text-underline-offset: 3px; }
        .prose-dark ul, .prose-dark ol { padding-left: 1.5rem; color: rgba(255,255,255,0.7); }
        .prose-dark li { margin: 0.35rem 0; }
        .prose-dark img { border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); max-width: 100%; }
        .prose-dark table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .prose-dark th { border: 1px solid rgba(255,255,255,0.1); padding: 0.75rem 1rem; background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.7); text-align: left; font-weight: 600; }
        .prose-dark td { border: 1px solid rgba(255,255,255,0.07); padding: 0.75rem 1rem; color: rgba(255,255,255,0.6); }
        .prose-dark hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2rem 0; }
      `}</style>
    </main>
  )
}
