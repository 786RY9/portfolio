import type { Metadata } from "next"
import Link from "next/link"
import { fetchServices } from "@/lib/cms-github"
import {
  Globe, Smartphone, Brain, Bot, Server, Shield,
  Terminal, Code2, Layers, Cpu, Wrench, Rocket,
  ArrowRight, Check, Mail
} from "lucide-react"

export const metadata: Metadata = {
  title: "Services — Rashid Yaseen",
  description: "Professional software development, AI engineering, cybersecurity, and DevOps services by Rashid Yaseen.",
}

export const revalidate = 300

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Smartphone, Brain, Bot, Server, Shield,
  Terminal, Code2, Layers, Cpu, Wrench, Rocket,
}

export default async function ServicesPage() {
  const services = await fetchServices()
  const featured = services.filter((s) => s.featured).sort((a, b) => a.order - b.order)
  const rest = services.filter((s) => !s.featured).sort((a, b) => a.order - b.order)
  const ordered = [...featured, ...rest]

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06] pb-24 pt-32">
        <div className="pointer-events-none absolute left-1/3 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[oklch(0.50_0.20_25)]/[0.06] blur-[180px]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">
            <Link href="/" className="transition hover:text-white/70">← Home</Link>
            <span className="h-px w-6 bg-white/20" />
            Services
          </p>
          <h1
            className="font-serif italic font-black text-white"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.92 }}
          >
            What I<br />
            <span style={{ color: "oklch(0.62 0.24 25)" }}>Build</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/50">
            From intelligent AI systems to bulletproof infrastructure, cross-platform apps to security audits —
            I bring deep technical expertise across the full stack.
          </p>
          <a
            href="mailto:rashidyaseen5484@gmail.com"
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-[oklch(0.55_0.22_25)]/40 bg-[oklch(0.55_0.22_25)]/10 px-6 py-3 text-sm font-semibold text-[oklch(0.7_0.18_25)] transition-all hover:bg-[oklch(0.55_0.22_25)]/20 hover:border-[oklch(0.55_0.22_25)]/60"
          >
            <Mail className="h-4 w-4" />
            Hire me for a project
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Services grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        {ordered.length === 0 ? (
          <div className="py-24 text-center text-sm text-white/30">
            Services coming soon.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ordered.map((svc) => {
              const Icon = ICON_MAP[svc.icon] ?? Globe
              return (
                <div
                  key={svc.id}
                  className={[
                    "group relative flex flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1",
                    svc.featured
                      ? "border-[oklch(0.55_0.22_25)]/30 bg-gradient-to-br from-[oklch(0.15_0.05_25)] to-black shadow-[0_0_60px_-20px_oklch(0.55_0.22_25_/_0.3)] hover:shadow-[0_0_80px_-20px_oklch(0.55_0.22_25_/_0.45)]"
                      : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]",
                  ].join(" ")}
                >
                  {svc.featured && (
                    <span className="absolute right-5 top-5 rounded-full border border-[oklch(0.55_0.22_25)]/40 bg-[oklch(0.55_0.22_25)]/10 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-[oklch(0.7_0.18_25)]">
                      Featured
                    </span>
                  )}

                  {/* Icon */}
                  <div className={[
                    "mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border transition-colors",
                    svc.featured
                      ? "border-[oklch(0.55_0.22_25)]/30 bg-[oklch(0.55_0.22_25)]/10 text-[oklch(0.7_0.18_25)]"
                      : "border-white/10 bg-white/[0.04] text-white/50 group-hover:border-white/20 group-hover:text-white/80",
                  ].join(" ")}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <h2 className="text-lg font-bold text-white">{svc.title}</h2>
                  <p className="mt-0.5 text-xs font-medium text-[oklch(0.65_0.22_25)]">{svc.tagline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">{svc.description}</p>

                  {svc.features.length > 0 && (
                    <ul className="mt-5 flex-1 space-y-2">
                      {svc.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-white/55">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(0.65_0.22_25)]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <a
                    href={`mailto:rashidyaseen5484@gmail.com?subject=Inquiry: ${encodeURIComponent(svc.title)}`}
                    className={[
                      "mt-6 inline-flex items-center gap-2 text-sm font-medium transition-all",
                      svc.featured
                        ? "text-[oklch(0.7_0.18_25)] hover:text-[oklch(0.8_0.18_25)]"
                        : "text-white/35 group-hover:text-white/70",
                    ].join(" ")}
                  >
                    Get in touch <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* CTA strip */}
      <section className="border-t border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-serif italic font-black text-white" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
            Have a project in mind?
          </h2>
          <p className="mt-3 text-sm text-white/45">
            I&apos;m available for freelance projects, consulting, and long-term contracts. Let&apos;s build something great.
          </p>
          <a
            href="mailto:rashidyaseen5484@gmail.com"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition-all hover:bg-white/90 hover:scale-105"
          >
            <Mail className="h-4 w-4" />
            rashidyaseen5484@gmail.com
          </a>
        </div>
      </section>
    </main>
  )
}
