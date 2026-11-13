import Image from "next/image"
import { ArrowUpRight, Lock } from "lucide-react"
import { projects, websites, type Project } from "@/data/projects"

/**
 * Homepage "Projects" section. Server component: everything here is in the
 * server-rendered HTML and needs no client JavaScript. Content lives in data/projects.ts.
 */

const ACCENT = "oklch(0.55 0.22 25)"
const ACCENT_GLOW = "oklch(0.7 0.18 25)"

// Shared keyboard focus ring for links in this section.
const FOCUS_RING =
  "outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[oklch(0.7_0.18_25)]"

export function SelectedProjects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative w-full scroll-mt-8 overflow-hidden bg-black py-24 sm:py-32"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-40 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[oklch(0.50_0.20_25)]/[0.05] blur-[160px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section heading (same pattern as Skills / Services) */}
        <div className="mb-16 flex flex-col items-center text-center sm:mb-24">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
            <span className="h-px w-8" style={{ backgroundColor: ACCENT }} />
            <span>// Projects</span>
            <span className="h-px w-8" style={{ backgroundColor: ACCENT }} />
          </div>
          <h2
            id="projects-heading"
            className="mt-6 font-serif text-5xl font-black italic tracking-tight text-white sm:text-7xl"
          >
            Selected work
          </h2>
          <p className="mt-4 max-w-xl text-balance text-sm leading-relaxed text-white/50">
            Machine learning, AI and full-stack projects, and what I built on each.
          </p>
        </div>

        <div className="flex flex-col gap-20 sm:gap-28">
          {projects.map((project, i) => (
            <ProjectRow key={project.id} project={project} reverse={i % 2 === 1} />
          ))}
        </div>

        {/* Websites */}
        {websites.length > 0 && (
          <div className="mt-24 sm:mt-32">
            <div className="mb-8 flex items-center gap-5">
              <h3 className="font-serif text-2xl italic text-white sm:text-3xl">Websites</h3>
              <span aria-hidden className="h-px flex-1 bg-white/10" />
            </div>
            <ul className="grid gap-4 sm:grid-cols-3">
              {websites.map((site) => (
                <li key={site.id}>
                  <a
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-[oklch(0.55_0.22_25)]/45 hover:bg-white/[0.04] ${FOCUS_RING}`}
                  >
                    <span className="text-sm text-white/50">{site.kind}</span>
                    <span className="mt-2 font-serif text-2xl italic text-white">{site.name}</span>
                    <span className="mt-6 flex items-center justify-between gap-3 font-mono text-xs text-white/50 transition-colors group-hover:text-white/80">
                      {site.href.replace(/^https?:\/\//, "")}
                      <ArrowUpRight
                        aria-hidden
                        className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-45 group-hover:text-[oklch(0.7_0.18_25)]"
                      />
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectRow({ project, reverse }: { project: Project; reverse: boolean }) {
  const titleId = `project-${project.id}-title`

  return (
    <article
      id={`project-${project.id}`}
      aria-labelledby={titleId}
      className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
    >
      {/* Text */}
      <div className={`lg:col-span-5 ${reverse ? "lg:order-2" : ""}`}>
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1">
          {project.context && (
            <span className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: ACCENT_GLOW }}>
              {project.context}
            </span>
          )}
          <span aria-hidden className="h-px min-w-6 flex-1 bg-white/10" />
          {project.year && (
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">{project.year}</span>
          )}
        </div>

        <h3
          id={titleId}
          className="font-serif font-black italic tracking-tight text-white"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1 }}
        >
          {project.title}
        </h3>

        <p className="mt-4 text-lg leading-snug text-white/80">{project.hook}</p>

        {project.badge && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
            <Lock aria-hidden className="h-3 w-3 shrink-0" />
            {project.badge}
          </p>
        )}

        <ul className="mt-5 space-y-2">
          {project.body.map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-white/55">
              <span
                aria-hidden
                className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: ACCENT_GLOW }}
              />
              {line}
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-white/15 bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/70"
            >
              {tag}
            </li>
          ))}
        </ul>

        {project.links && project.links.length > 0 && (
          <div className="mt-7 flex flex-wrap items-center gap-6">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group/link inline-flex items-center gap-2 rounded-sm font-mono text-xs uppercase tracking-[0.3em] text-white/80 transition-colors hover:text-[oklch(0.7_0.18_25)] ${FOCUS_RING}`}
              >
                {link.label}
                <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover/link:rotate-45" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* IMAGE SLOT: set `image` on the project in data/projects.ts (files go in public/projects/) */}
      <div className={`lg:col-span-7 ${reverse ? "lg:order-1" : ""}`}>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/[0.07] transition-colors duration-500 group-hover:border-white/15">
          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder title={project.title} />
          )}
        </div>
      </div>
    </article>
  )
}

/** Shown until a screenshot is added. Decorative only: the title is already in the h3. */
function ImagePlaceholder({ title }: { title: string }) {
  const label = title.split(":")[0]
  return (
    <div aria-hidden className="absolute inset-0 bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,oklch(0.55_0.22_25_/_0.22),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 1px, transparent 1px, transparent 4px)",
        }}
      />
      <span
        className="absolute inset-x-6 bottom-5 font-serif font-black italic sm:inset-x-8 sm:bottom-7"
        style={{
          fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)",
          lineHeight: 0.95,
          color: "rgba(255,255,255,0.04)",
          WebkitTextStroke: "1px rgba(255,255,255,0.3)",
        }}
      >
        {label}
      </span>
    </div>
  )
}
