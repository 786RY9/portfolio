"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Github, Lock, Star, GitFork, Clock, Wifi } from "lucide-react"
import type { GithubProject } from "@/lib/github"
import { ProjectModal } from "@/components/project-modal"

// Language dot colors (matches GitHub's language colours)
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Dart: "#00B4AB",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

/* ── Loading skeleton ──────────────────────────────────────── */
function ProjectSkeleton() {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center animate-pulse">
      <div className="lg:col-span-5 flex flex-col gap-5">
        <div className="h-3 w-16 rounded bg-white/10" />
        <div className="h-14 w-3/4 rounded bg-white/10" />
        <div className="h-20 w-full rounded bg-white/[0.07]" />
        <div className="flex gap-2">
          {[1, 2, 3].map((k) => <div key={k} className="h-6 w-20 rounded-full bg-white/10" />)}
        </div>
      </div>
      <div className="lg:col-span-7 aspect-[16/10] rounded-lg bg-white/[0.05]" />
    </div>
  )
}

/* ── Error state ───────────────────────────────────────────── */
function ProjectsError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <Wifi className="h-8 w-8 text-white/20" />
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
        Could not load projects
      </p>
      <p className="text-white/20 text-sm max-w-sm">{message}</p>
    </div>
  )
}

/* ── Main section ──────────────────────────────────────────── */
export function Projects() {
  const [projects, setProjects] = useState<GithubProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [modalProject, setModalProject] = useState<GithubProject | null>(null)

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`)
        return res.json()
      })
      .then((data: GithubProject[]) => {
        setProjects(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const displayCount = loading ? 3 : projects.length

  return (
    <>
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
              {loading
                ? "Loading..."
                : `${String(activeIdx + 1).padStart(2, "0")} / ${String(displayCount).padStart(2, "0")}`}
            </p>
            {!loading && projects[activeIdx] && (
              <p className="mt-2 font-serif italic text-2xl text-white/90">
                {projects[activeIdx].title}
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 flex flex-col gap-24 sm:gap-32">
          {loading ? (
            <>
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
            </>
          ) : error ? (
            <ProjectsError message={error} />
          ) : projects.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
                No projects tagged with "portfolio" yet
              </p>
            </div>
          ) : (
            projects.map((p, i) => (
              <ProjectRow
                key={p.slug}
                project={p}
                index={i}
                onActive={() => setActiveIdx(i)}
                onOpenDemo={() => setModalProject(p)}
              />
            ))
          )}
        </div>
      </section>

      {/* Demo modal */}
      {modalProject && (
        <ProjectModal
          project={modalProject}
          onClose={() => setModalProject(null)}
        />
      )}
    </>
  )
}

/* ── Project Row ───────────────────────────────────────────── */
function ProjectRow({
  project,
  index,
  onActive,
  onOpenDemo,
}: {
  project: GithubProject
  index: number
  onActive: () => void
  onOpenDemo: () => void
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
        transition:
          "opacity 900ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Text side */}
      <div className={`lg:col-span-5 flex flex-col gap-5 ${reverse ? "lg:order-2" : "lg:order-1"}`}>

        {/* Index + year row */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-[oklch(0.7_0.18_25)]">
            ({project.num})
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <div className="flex items-center gap-3">
            {/* Private badge */}
            {project.isPrivate && (
              <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
                <Lock className="h-2.5 w-2.5" />
                Private
              </span>
            )}
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
              {project.year}
            </span>
          </div>
        </div>

        {/* Title */}
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

        {/* Description */}
        <p className="text-white/60 max-w-md leading-relaxed">
          {project.description}
        </p>

        {/* Language badges */}
        <div className="flex flex-wrap gap-2">
          {project.languages.map((lang) => (
            <span
              key={lang}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm"
            >
              <span
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: LANG_COLORS[lang] ?? "#888" }}
              />
              {lang}
            </span>
          ))}
        </div>

        {/* Stars / forks / last active */}
        {(project.stars > 0 || project.forks > 0 || project.pushedAt) && (
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
            {project.stars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {project.stars}
              </span>
            )}
            {project.forks > 0 && (
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                {project.forks}
              </span>
            )}
            {project.pushedAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {relativeTime(project.pushedAt)}
              </span>
            )}
          </div>
        )}

        {/* Action links */}
        <div className="flex flex-wrap items-center gap-5 mt-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-white/80 transition-colors hover:text-[oklch(0.7_0.18_25)]"
            >
              Live Demo
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-white/80"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Visual side — click to open demo modal */}
      <button
        onClick={onOpenDemo}
        aria-label={`Open ${project.title} demo`}
        data-cursor="Play Demo"
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
        {/* Cover image */}
        <img
          src={project.coverUrl}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: hover ? "scale(1.06)" : "scale(1)" }}
          loading="lazy"
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

        {/* Play indicator */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: hover ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        >
          <div className="flex items-center gap-2 rounded-full bg-black/70 border border-white/15 px-5 py-2.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.7_0.18_25)]" style={{ animation: "pulseDot 1.5s ease-in-out infinite" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/80">
              Play Demo
            </span>
          </div>
        </div>

        {/* Shine sweep on hover */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
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
            {project.languages[0] ?? project.role}
          </span>
        </div>

        {/* Index + year corner */}
        <div className="absolute right-5 bottom-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
          {project.num} — {project.year}
        </div>
      </button>
    </div>
  )
}
