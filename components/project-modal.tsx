"use client"

import { useEffect, useRef } from "react"
import { ArrowUpRight, Github, X, Lock, Star, GitFork, Clock } from "lucide-react"
import type { GithubProject } from "@/lib/github"

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
  Dockerfile: "#384d54",
  YAML: "#cb171e",
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: GithubProject
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    // Lock body scroll
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  // Click outside modal panel to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="project-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} demo`}
    >
      <div className="project-modal-panel">

        {/* ── Header bar ── */}
        <div className="project-modal-header">
          <div className="flex items-center gap-3 min-w-0">
            {project.isPrivate && (
              <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.4em] text-white/40">
                <Lock className="h-2.5 w-2.5" />
                Private
              </span>
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
              {project.num} / Project Demo
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="modal-close-btn"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Media area: video preferred, gif fallback ── */}
        <div className="project-modal-media">
          {project.demoVideoUrl ? (
            <video
              ref={videoRef}
              src={project.demoVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={project.demoGifUrl}
              alt={`${project.title} demo`}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* ── Info panel ── */}
        <div className="project-modal-info">

          {/* Title + description */}
          <div className="flex-1 min-w-0">
            <h2 className="font-serif italic font-black text-white tracking-tight text-3xl md:text-4xl leading-tight mb-3">
              {project.title}
            </h2>
            <p className="text-white/55 leading-relaxed text-sm md:text-base max-w-lg">
              {project.description}
            </p>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-white/35 font-mono text-[10px] uppercase tracking-[0.3em]">
            {project.stars > 0 && (
              <span className="flex items-center gap-1.5">
                <Star className="h-3 w-3" />
                {project.stars}
              </span>
            )}
            {project.forks > 0 && (
              <span className="flex items-center gap-1.5">
                <GitFork className="h-3 w-3" />
                {project.forks}
              </span>
            )}
            {project.pushedAt && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {relativeTime(project.pushedAt)}
              </span>
            )}
            <span>{project.year}</span>
          </div>

          {/* Language badges */}
          {project.languages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.languages.map((lang) => (
                <span
                  key={lang}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/70"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: LANG_COLORS[lang] ?? "#888" }}
                  />
                  {lang}
                </span>
              ))}
            </div>
          )}

          {/* Action links */}
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="modal-action-btn modal-action-primary"
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
                className="modal-action-btn modal-action-ghost"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            )}
            {project.isPrivate && !project.githubUrl && (
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">
                <Lock className="h-3 w-3" />
                Private Repository
              </span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .project-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: overlayIn 250ms ease forwards;
        }
        @keyframes overlayIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        .project-modal-panel {
          position: relative;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          background: oklch(0.08 0.005 250);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          box-shadow:
            0 40px 120px -20px rgba(0,0,0,0.8),
            0 0 0 1px rgba(255,255,255,0.05) inset;
          animation: panelIn 300ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes panelIn {
          from { opacity: 0; transform: scale(0.94) translateY(16px) }
          to   { opacity: 1; transform: scale(1) translateY(0) }
        }
        .project-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .modal-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: background 200ms, color 200ms;
          flex-shrink: 0;
        }
        .modal-close-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .project-modal-media {
          width: 100%;
          background: #000;
          max-height: 55vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .project-modal-info {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.5rem 1.75rem;
        }
        .modal-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 9999px;
          padding: 0.6rem 1.25rem;
          font-family: var(--font-sans, system-ui);
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          transition: all 250ms ease;
          text-decoration: none;
        }
        .modal-action-primary {
          background: oklch(0.55 0.22 25);
          color: #fff;
          border: 1px solid transparent;
        }
        .modal-action-primary:hover {
          background: oklch(0.62 0.24 25);
          box-shadow: 0 0 24px oklch(0.55 0.22 25 / 0.4);
        }
        .modal-action-ghost {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.75);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .modal-action-ghost:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
      `}</style>
    </div>
  )
}
