import type { Metadata } from "next"
import Link from "next/link"
import { listPosts } from "@/lib/cms-github"
import { ArrowRight, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Learning Log — Rashid Yaseen",
  description: "My ongoing learning journey — functional programming, cybersecurity, AI, DevOps, and everything in between.",
}

export const revalidate = 60

export default async function LearningsPage() {
  const entries = await listPosts("learnings", false)

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/[0.06] pb-24 pt-32">
        <div className="pointer-events-none absolute right-1/4 top-0 h-[500px] w-[700px] translate-x-1/2 rounded-full bg-[oklch(0.45_0.18_270)]/[0.05] blur-[160px]" />
        <div className="relative mx-auto max-w-5xl px-6">
          <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">
            <Link href="/" className="transition hover:text-white/70">← Home</Link>
            <span className="h-px w-6 bg-white/20" />
            Learning Log
          </p>
          <h1 className="font-serif italic font-black text-white" style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.92 }}>
            What I&apos;m<br />
            <span style={{ color: "oklch(0.62 0.24 25)" }}>Learning</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/50">
            A living record of concepts, tools, and skills I&apos;m actively exploring — with proof of work through screenshots, code, and notes.
          </p>
        </div>
      </section>

      {/* Timeline entries */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        {entries.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm text-white/30">No entries published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/[0.06]" />

            <div className="space-y-6">
              {entries.map((entry, i) => (
                <Link
                  key={entry.slug}
                  href={`/learnings/${entry.slug}`}
                  className="group relative flex gap-6 pl-8"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-5 h-[22px] w-[22px] rounded-full border-2 border-[oklch(0.55_0.22_25)]/50 bg-black transition-colors duration-300 group-hover:border-[oklch(0.65_0.22_25)] group-hover:bg-[oklch(0.55_0.22_25)]/20" />

                  {/* Card */}
                  <div className="flex-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.05] group-hover:-translate-y-0.5">
                    {/* Tags */}
                    {entry.tags.length > 0 && (
                      <div className="mb-2.5 flex flex-wrap gap-1.5">
                        {entry.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-white/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="text-base font-bold text-white group-hover:text-white/90">
                      {entry.title}
                    </h2>
                    {entry.excerpt && (
                      <p className="mt-1.5 line-clamp-2 text-sm text-white/45">{entry.excerpt}</p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-white/25">
                        <Calendar className="h-3 w-3" />
                        {new Date(entry.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-[oklch(0.65_0.22_25)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5">
                        Read more <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
