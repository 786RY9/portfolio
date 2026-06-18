"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

export type Project = {
  slug: string
  num: string
  title: string
  role: string[]
  year: string
  image: string
  description: string
  link?: string
}

export const PROJECTS: Project[] = [
  {
    slug: "threatx",
    num: "01",
    title: "ThreatX",
    role: ["Machine Learning", "Security", "Full-Stack"],
    year: "2025",
    image: "/projects/threatx.jpg",
    description:
      "AI-based malware detection and prevention system. Real-time classification of threats with deep learning, automated response pipeline, and a security analyst dashboard.",
  },
  {
    slug: "diners",
    num: "02",
    title: "Diners — Shared Cart",
    role: ["Flutter", "Realtime", "Product"],
    year: "2025",
    image: "/projects/diners.jpg",
    description:
      "A Diners-style food ordering clone re-imagined around a multi-user shared cart, so groups can build one order together in real time and split the bill instantly.",
  },
  {
    slug: "ml-platform",
    num: "03",
    title: "Atlas ML Platform",
    role: ["MLOps", "Python", "Kubernetes"],
    year: "2025",
    image: "/projects/ml-platform.jpg",
    description:
      "End-to-end ML training and serving platform with experiment tracking, GPU-aware scheduling, and one-click model rollout to production.",
  },
  {
    slug: "rag-agent",
    num: "04",
    title: "Lumen Agentic RAG",
    role: ["LLM", "Agents", "Vector DB"],
    year: "2024",
    image: "/projects/rag-agent.jpg",
    description:
      "An agentic RAG framework that plans multi-step retrieval, cites sources, and self-corrects answers — built on top of a hybrid vector + keyword index.",
  },
  {
    slug: "devops-suite",
    num: "05",
    title: "ShipKit DevOps Suite",
    role: ["DevOps", "CI/CD", "Infra"],
    year: "2024",
    image: "/projects/devops.jpg",
    description:
      "A drop-in CI/CD and observability suite: GitHub Actions templates, Terraform modules, and a unified dashboard for deploy health across services.",
  },
  {
    slug: "flutter-fitness",
    num: "06",
    title: "Pulse Fitness",
    role: ["Flutter", "Health", "Design"],
    year: "2024",
    image: "/projects/flutter-app.jpg",
    description:
      "A cross-platform fitness companion with adaptive workout plans, heart-rate analytics, and offline-first sync across devices.",
  },
]

export function Projects() {
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <section
      id="work"
      className="relative bg-black py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Section label */}
      <div className="mx-auto mb-16 flex max-w-7xl items-end justify-between px-6">
        <div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
            <span className="h-px w-8 bg-[oklch(0.55_0.22_25)]" />
            <span>// Selected Work</span>
          </div>
          <h2 className="mt-6 font-serif italic font-black text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight">
            The Work
          </h2>
        </div>
        <div className="hidden md:block text-right">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            {String(activeIdx + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
          </p>
          <p className="mt-2 font-serif italic text-2xl text-white/90">
            {PROJECTS[activeIdx].title}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 flex flex-col gap-24 sm:gap-32">
        {PROJECTS.map((p, i) => (
          <ProjectRow
            key={p.slug}
            project={p}
            index={i}
            onActive={() => setActiveIdx(i)}
          />
        ))}
      </div>
    </section>
  )
}

function ProjectRow({
  project,
  index,
  onActive,
}: {
  project: Project
  index: number
  onActive: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const reverse = index % 2 === 1

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setRevealed(true)
            if (e.intersectionRatio > 0.55) onActive()
          }
        })
      },
      { threshold: [0.2, 0.55, 0.8] }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onActive])

  return (
    <div
      ref={ref}
      className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(60px)",
        transition: "opacity 900ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Text side */}
      <div
        className={`lg:col-span-5 flex flex-col gap-5 ${reverse ? "lg:order-2" : "lg:order-1"}`}
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-[oklch(0.7_0.18_25)]">
            ({project.num})
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            {project.year}
          </span>
        </div>

        <h3
          className="font-serif italic font-black text-white tracking-tight"
          style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)", lineHeight: 0.95 }}
        >
          <span className="relative inline-block">
            {project.title}
            <span
              className="absolute -bottom-2 left-0 h-[3px] bg-[oklch(0.55_0.22_25)] origin-left"
              style={{
                width: "100%",
                transform: hover ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </span>
        </h3>

        <p className="text-white/60 max-w-md leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.role.map((r) => (
            <span
              key={r}
              className="rounded-full border border-white/15 bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm"
            >
              {r}
            </span>
          ))}
        </div>

        <a
          href="#contact"
          data-cursor="View"
          className="mt-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-white/80 transition-colors hover:text-[oklch(0.7_0.18_25)]"
        >
          View case study
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </div>

      {/* Visual side */}
      <a
        href="#contact"
        data-cursor="View"
        className={`relative lg:col-span-7 block aspect-[16/10] w-full overflow-hidden rounded-lg ${
          reverse ? "lg:order-1" : "lg:order-2"
        }`}
        style={{
          boxShadow: hover
            ? "0 40px 100px -30px rgba(220,40,40,0.25), 0 0 0 1px rgba(255,255,255,0.06)"
            : "0 30px 80px -40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          transition: "box-shadow 500ms ease",
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: hover ? "scale(1.06)" : "scale(1)" }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

        {/* Shine sweep on hover */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{
              transform: hover ? "translateX(450%)" : "translateX(0)",
              transition: hover ? "transform 1100ms cubic-bezier(0.22,1,0.36,1)" : "none",
            }}
          />
        </div>

        {/* Tag corner */}
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.18_25)]"
            style={{ animation: "pulseDot 2s ease-in-out infinite" }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">
            {project.role[0]}
          </span>
        </div>

        <div className="absolute right-5 bottom-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
          {String(index + 1).padStart(2, "0")} \u2014 {project.year}
        </div>
      </a>
    </div>
  )
}
