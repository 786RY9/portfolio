"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const STATS = [
  { value: 12, suffix: "+", label: "Projects shipped" },
  { value: 8, suffix: "", label: "Happy clients" },
  { value: 4, suffix: "yr", label: "Building products" },
  { value: 99, suffix: "%", label: "On-time delivery" },
]

const TESTIMONIALS = [
  {
    quote:
      "Rashid took our messy ML prototype and turned it into a production system in weeks. The pipeline he built still hasn't broken.",
    name: "Daniel Ortega",
    role: "CTO",
    company: "Northwind Labs",
    avatar: "/avatars/a1.jpg",
  },
  {
    quote:
      "He shipped a Flutter app that genuinely feels native on both platforms. Code reviews from him taught my team more than any course.",
    name: "Priya Raman",
    role: "Engineering Manager",
    company: "Forge Studio",
    avatar: "/avatars/a2.jpg",
  },
  {
    quote:
      "The DevOps overhaul cut our deploy time from 40 minutes to under 5. He genuinely cares about the craft.",
    name: "Omar Al-Sayed",
    role: "Founder",
    company: "Helix Systems",
    avatar: "/avatars/a3.jpg",
  },
  {
    quote:
      "Fast, thoughtful, and a real partner — not just a contractor. Rashid is the rare engineer who gets product too.",
    name: "Sara Lindqvist",
    role: "Head of Product",
    company: "Vellum",
    avatar: "/avatars/a4.jpg",
  },
]

const LOGOS = [
  "Northwind",
  "Forge",
  "Helix",
  "Vellum",
  "Atlas",
  "Lumen",
  "Pulse",
  "Shipkit",
]

export function Feedback() {
  return (
    <section
      id="feedback"
      className="relative bg-black py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
            <span className="h-px w-8 bg-[oklch(0.55_0.22_25)]" />
            <span>// The Feedback Loop</span>
            <span className="h-px w-8 bg-[oklch(0.55_0.22_25)]" />
          </div>
          <h2
            className="mt-6 font-serif italic font-black text-white tracking-tight max-w-4xl"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", lineHeight: 1 }}
          >
            Proof of impact from a <span className="text-[oklch(0.7_0.18_25)]">trusted network.</span>
          </h2>
          <p className="mt-6 max-w-xl text-white/55 leading-relaxed">
            Real outcomes from teams I&apos;ve shipped with — engineers, founders, and operators who count on the work to hold up under pressure.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mb-20">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} {...t} index={i} />
          ))}
        </div>

        {/* Logo wall */}
        <div className="relative mt-20 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-black to-transparent" />
          <div className="flex w-max gap-16 animate-[marquee_28s_linear_infinite]">
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((l, i) => (
              <span
                key={i}
                className="font-serif italic text-3xl text-white/30 hover:text-white/80 transition-colors whitespace-nowrap"
              >
                {l}
                <span className="text-[oklch(0.55_0.22_25)]">.</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const dur = 1600
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / dur)
              const eased = 1 - Math.pow(1 - p, 3)
              setN(Math.round(eased * value))
              if (p < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <div
      ref={ref}
      className="group relative bg-black p-8 sm:p-10 transition-colors hover:bg-[oklch(0.07_0_0)]"
    >
      <div
        className="font-serif italic font-black text-white tracking-tight"
        style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
      >
        {n}
        <span className="text-[oklch(0.7_0.18_25)]">{suffix}</span>
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
        {label}
      </p>
      <div className="absolute inset-x-8 bottom-0 h-px bg-[oklch(0.55_0.22_25)] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  )
}

function TestimonialCard({
  quote,
  name,
  role,
  company,
  avatar,
  index,
}: {
  quote: string
  name: string
  role: string
  company: string
  avatar: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setRevealed(true)),
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 2
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 2
    setTilt({ x: dx, y: dy })
  }
  const onLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent p-8 sm:p-10 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-[oklch(0.55_0.22_25)]/40"
      style={{
        transform: `perspective(1200px) rotateY(${tilt.x * 4}deg) rotateX(${-tilt.y * 4}deg) translateY(${revealed ? 0 : 40}px)`,
        opacity: revealed ? 1 : 0,
        transition: `transform 400ms cubic-bezier(0.22,1,0.36,1), opacity 800ms ${index * 80}ms ease-out`,
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.02), 0 30px 80px -40px rgba(0,0,0,0.7)",
      }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx) var(--my), rgba(220,40,40,0.10), transparent 40%)",
        }}
      />
      <span className="absolute -top-4 left-8 font-serif italic text-7xl text-[oklch(0.55_0.22_25)]/40 leading-none select-none">
        \u201C
      </span>
      <p className="font-serif italic text-xl sm:text-2xl text-white/90 leading-snug text-balance">
        {quote}
      </p>
      <div className="mt-8 flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-white/20 group-hover:ring-[oklch(0.55_0.22_25)]/60 transition-all">
          <Image src={avatar} alt={name} fill className="object-cover" sizes="48px" />
        </div>
        <div>
          <p className="font-sans text-sm font-semibold text-white">{name}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
            {role} \u00B7 {company}
          </p>
        </div>
      </div>
    </div>
  )
}
