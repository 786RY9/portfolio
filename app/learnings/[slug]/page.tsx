import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { fetchPost, listPosts } from "@/lib/cms-github"
import { PostRendererWrapper } from "@/components/PostRendererClient"
import { Calendar, ArrowLeft } from "lucide-react"
import type { PartialBlock } from "@blocknote/core"

export const revalidate = 60

export async function generateStaticParams() {
  const entries = await listPosts("learnings", false)
  return entries.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = await fetchPost("learnings", slug)
  if (!entry || entry.draft) return { title: "Not Found" }
  return {
    title: `${entry.title} — Learning Log · Rashid Yaseen`,
    description: entry.excerpt,
  }
}

export default async function LearningEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = await fetchPost("learnings", slug)
  if (!entry || entry.draft) notFound()

  return (
    <main className="min-h-screen bg-black text-white">
      {entry.coverUrl && (
        <div className="relative h-[35vh] max-h-[400px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={entry.coverUrl} alt={entry.title} className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
        </div>
      )}

      <article className={`mx-auto max-w-3xl px-6 ${entry.coverUrl ? "-mt-16 pt-0" : "pt-32"} pb-24`}>
        <Link
          href="/learnings"
          className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 transition hover:text-white/70"
        >
          <ArrowLeft className="h-3 w-3" /> Learning Log
        </Link>

        {entry.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="mb-4 font-serif italic font-black text-white leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          {entry.title}
        </h1>

        <div className="mb-8 flex items-center gap-4 border-b border-white/[0.06] pb-8 text-xs text-white/30">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(entry.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        {entry.excerpt && (
          <p className="mb-8 border-l-2 border-[oklch(0.55_0.22_25)]/50 pl-5 text-lg italic leading-relaxed text-white/60">
            {entry.excerpt}
          </p>
        )}

        <div className="prose-dark">
          <PostRendererWrapper content={entry.content as PartialBlock[]} />
        </div>

        <div className="mt-16 border-t border-white/[0.06] pt-8">
          <Link href="/learnings" className="inline-flex items-center gap-2 text-sm text-[oklch(0.65_0.22_25)] hover:text-[oklch(0.75_0.18_25)]">
            <ArrowLeft className="h-4 w-4" /> Back to Learning Log
          </Link>
        </div>
      </article>

      <style>{`
        .prose-dark .bn-editor { background: transparent !important; }
        .prose-dark .bn-editor [contenteditable] { padding: 0; cursor: default; }
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
      `}</style>
    </main>
  )
}
