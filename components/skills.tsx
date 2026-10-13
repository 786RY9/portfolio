"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Skill = {
  id: string
  title: string
  subtitle: string
  details: string[]
}

const skills: Skill[] = [
  {
    id: "flutter",
    title: "Flutter",
    subtitle: "Cross-platform apps",
    details: ["Dart", "iOS", "Android", "macOS", "Windows", "Linux", "Web", "Riverpod", "Bloc"],
  },
  {
    id: "ml",
    title: "Machine & Deep Learning",
    subtitle: "ML / DL Engineering",
    details: ["Python", "PyTorch", "TensorFlow", "scikit-learn", "Transformers", "CV", "NLP"],
  },
  {
    id: "devops",
    title: "DevOps",
    subtitle: "CI / CD & Infra",
    details: ["Docker", "Kubernetes", "GitHub Actions", "Terraform", "AWS", "Nginx", "Monitoring"],
  },
  {
    id: "python",
    title: "Python",
    subtitle: "Backend & scripting",
    details: ["FastAPI", "Flask", "Django", "asyncio", "Pandas", "NumPy", "Automation"],
  },
  {
    id: "linux",
    title: "Linux Sysadmin",
    subtitle: "RHEL & beyond",
    details: ["RHEL", "systemd", "SELinux", "Bash", "Networking", "Ansible", "Hardening"],
  },
  {
    id: "wordpress",
    title: "WordPress",
    subtitle: "CMS & themes",
    details: ["PHP", "Custom themes", "WooCommerce", "Plugins", "SEO", "Performance"],
  },
  {
    id: "ai",
    title: "RAG & Agentic AI",
    subtitle: "LLM systems",
    details: ["LLMs", "RAG", "Vector DBs", "LangChain", "n8n", "Make", "Agents"],
  },
  {
    id: "security",
    title: "Cyber Security",
    subtitle: "Penetration testing",
    details: ["Recon", "Burp Suite", "Nmap", "Metasploit", "OWASP", "Linux pentest", "Hardening"],
  },
]

export function Skills() {
  const [active, setActive] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([])
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })

  const activeSkill = skills.find((s) => s.id === active) ?? null

  useEffect(() => {
    if (!active || !containerRef.current) {
      setLines([])
      return
    }
    const calc = () => {
      const containerEl = containerRef.current
      if (!containerEl) return
      const cRect = containerEl.getBoundingClientRect()
      setContainerSize({ w: cRect.width, h: cRect.height })
      const cardEl = cardRefs.current[active]
      if (!cardEl) return
      const cardRect = cardEl.getBoundingClientRect()
      const isLeftColumn = skills.findIndex((s) => s.id === active) % 2 === 0
      const x1 = (isLeftColumn ? cardRect.right : cardRect.left) - cRect.left
      const y1 = cardRect.top + cardRect.height / 2 - cRect.top
      const detailNodes = containerEl.querySelectorAll<HTMLElement>("[data-detail]")
      const newLines: { x1: number; y1: number; x2: number; y2: number }[] = []
      detailNodes.forEach((node) => {
        const r = node.getBoundingClientRect()
        const x2 = (isLeftColumn ? r.left : r.right) - cRect.left
        const y2 = r.top + r.height / 2 - cRect.top
        newLines.push({ x1, y1, x2, y2 })
      })
      setLines(newLines)
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(containerRef.current)
    window.addEventListener("scroll", calc, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", calc)
    }
  }, [active])

  return (
    <section id="skills" className="relative w-full bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
            <span className="h-px w-8 bg-[oklch(0.55_0.22_25)]" />
            <span>// Skills</span>
            <span className="h-px w-8 bg-[oklch(0.55_0.22_25)]" />
          </div>
          <h2 className="mt-6 font-serif italic font-black text-5xl sm:text-7xl text-white tracking-tight">
            What I work with
          </h2>
          <p className="mt-4 max-w-xl text-balance text-sm leading-relaxed text-white/50">
            Hover any card to expand the constellation of tools and concepts behind it.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative"
          onMouseLeave={() => setActive(null)}
        >
          <svg
            className="pointer-events-none absolute inset-0 z-20"
            width={containerSize.w}
            height={containerSize.h}
            viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
            style={{ width: "100%", height: "100%" }}
          >
            <AnimatePresence>
              {lines.map((l, i) => (
                <motion.line
                  key={`${active}-${i}`}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="oklch(0.7 0.18 25 / 0.55)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.04, ease: "easeOut" }}
                />
              ))}
            </AnimatePresence>
          </svg>

          <div
            className="grid items-stretch gap-6"
            style={{
              gridTemplateColumns: active ? "1fr minmax(220px, 28%) 1fr" : "1fr 0px 1fr",
              transition: "grid-template-columns 500ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div className="flex flex-col gap-5">
              {skills
                .filter((_, i) => i % 2 === 0)
                .map((s) => (
                  <SkillCard
                    key={s.id}
                    skill={s}
                    active={active === s.id}
                    dimmed={active !== null && active !== s.id}
                    onHover={() => setActive(s.id)}
                    refCb={(el) => {
                      cardRefs.current[s.id] = el
                    }}
                    align="left"
                  />
                ))}
            </div>

            <div className="relative z-10 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {activeSkill && (
                  <motion.div
                    key={activeSkill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex w-full flex-col items-center gap-4 py-6"
                  >
                    <div className="text-center">
                      <div className="text-[10px] uppercase tracking-[0.4em] text-[oklch(0.7_0.18_25)]">
                        Stack
                      </div>
                      <div className="mt-2 font-serif text-2xl italic text-white">
                        {activeSkill.title}
                      </div>
                    </div>
                    <ul className="flex w-full flex-col items-center gap-2">
                      {activeSkill.details.map((d, i) => (
                        <motion.li
                          key={d}
                          data-detail
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                          className="w-full rounded-md border border-[oklch(0.55_0.22_25)]/25 bg-white/[0.02] px-3 py-1.5 text-center text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm"
                        >
                          {d}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-5">
              {skills
                .filter((_, i) => i % 2 === 1)
                .map((s) => (
                  <SkillCard
                    key={s.id}
                    skill={s}
                    active={active === s.id}
                    dimmed={active !== null && active !== s.id}
                    onHover={() => setActive(s.id)}
                    refCb={(el) => {
                      cardRefs.current[s.id] = el
                    }}
                    align="right"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SkillCard({
  skill,
  active,
  dimmed,
  onHover,
  refCb,
  align,
}: {
  skill: Skill
  active: boolean
  dimmed: boolean
  onHover: () => void
  refCb: (el: HTMLDivElement | null) => void
  align: "left" | "right"
}) {
  return (
    <motion.div
      ref={refCb}
      onMouseEnter={onHover}
      animate={{
        scale: dimmed ? 0.94 : 1,
        opacity: dimmed ? 0.35 : 1,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={[
        "group relative flex-1 cursor-pointer rounded-2xl border p-6 backdrop-blur-sm transition-colors",
        active
          ? "border-[oklch(0.55_0.22_25)]/60 bg-gradient-to-br from-red-950/40 to-black"
          : "border-white/10 bg-black",
        align === "right" ? "text-right" : "text-left",
      ].join(" ")}
      style={{
        boxShadow: active
          ? "0 0 0 1px oklch(0.55 0.22 25 / 0.25), 0 30px 60px -20px oklch(0.55 0.22 25 / 0.25)"
          : "0 0 0 1px rgba(255,255,255,0.02)",
      }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
          {String(skill.id).padStart(2, "0").slice(0, 2)}
        </span>
        <span
          className={[
            "h-1.5 w-1.5 rounded-full transition-colors",
            active ? "bg-[oklch(0.7_0.18_25)]" : "bg-white/20",
          ].join(" ")}
        />
      </div>
      <h3 className="mt-6 font-serif text-3xl italic text-white sm:text-4xl">
        {skill.title}
      </h3>
      <p className="mt-2 text-sm text-white/50">{skill.subtitle}</p>
      <div
        className={[
          "absolute inset-x-6 bottom-4 h-px origin-left bg-[oklch(0.55_0.22_25)]/60 transition-transform duration-500",
          active ? "scale-x-100" : "scale-x-0",
        ].join(" ")}
      />
    </motion.div>
  )
}
