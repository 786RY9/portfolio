"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Globe, Smartphone, Brain, Bot, Server, Shield,
  Terminal, Code2, Layers, Cpu, Wrench, Rocket,
  ArrowUpRight
} from "lucide-react"
import type { Service } from "@/lib/cms-types"

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Smartphone, Brain, Bot, Server, Shield,
  Terminal, Code2, Layers, Cpu, Wrench, Rocket,
}

// Fallback defaults shown before data loads or if GitHub is unreachable
const FALLBACK_SERVICES: Service[] = [
  {
    id: "web",
    title: "Web App Development",
    tagline: "Next.js · FastAPI · Full-Stack",
    description: "Performant, scalable web applications built with modern stacks.",
    icon: "Globe",
    features: ["Next.js / React", "FastAPI / Django", "PostgreSQL / Redis"],
    featured: true,
    order: 0,
  },
  {
    id: "flutter",
    title: "Flutter Apps",
    tagline: "iOS · Android · Desktop",
    description: "Native-quality cross-platform mobile apps from a single codebase.",
    icon: "Smartphone",
    features: ["iOS & Android", "macOS & Windows", "Riverpod / Bloc"],
    featured: true,
    order: 1,
  },
  {
    id: "ai",
    title: "RAG & Agentic AI",
    tagline: "LLMs · Agents · Automation",
    description: "Production-ready AI pipelines, RAG systems, and autonomous agents.",
    icon: "Bot",
    features: ["LangChain / LlamaIndex", "Vector databases", "n8n / Make automation"],
    featured: true,
    order: 2,
  },
]

export function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data: Service[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const featured = data.filter((s) => s.featured).sort((a, b) => a.order - b.order)
          setServices(featured.slice(0, 3))
        } else {
          setServices(FALLBACK_SERVICES)
        }
        setLoading(false)
      })
      .catch(() => {
        setServices(FALLBACK_SERVICES)
        setLoading(false)
      })
  }, [])

  const display = loading ? FALLBACK_SERVICES : services

  return (
    <section id="services" className="relative w-full bg-black py-24 sm:py-32">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-[oklch(0.50_0.20_25)]/[0.04] blur-[160px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          className="mb-16 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
            <span className="h-px w-8 bg-[oklch(0.55_0.22_25)]" />
            <span>// Services</span>
            <span className="h-px w-8 bg-[oklch(0.55_0.22_25)]" />
          </div>
          <h2 className="mt-6 font-serif italic font-black text-5xl sm:text-7xl text-white tracking-tight">
            What I Build
          </h2>
          <p className="mt-4 max-w-xl text-balance text-sm leading-relaxed text-white/50">
            From AI systems to mobile apps — I design and ship production-ready solutions across the full technology stack.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {display.map((svc, i) => {
            const Icon = ICON_MAP[svc.icon] ?? Globe
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                className="group relative flex flex-col rounded-2xl border border-[oklch(0.55_0.22_25)]/20 bg-gradient-to-br from-[oklch(0.12_0.04_25)] to-black p-7 transition-all duration-500 hover:border-[oklch(0.55_0.22_25)]/45 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_oklch(0.55_0.22_25_/_0.2)]"
              >
                {/* Glow on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,_oklch(0.55_0.22_25_/_0.07),_transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Number */}
                <span className="absolute right-6 top-5 font-mono text-[10px] tracking-widest text-white/15">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[oklch(0.55_0.22_25)]/30 bg-[oklch(0.55_0.22_25)]/10 text-[oklch(0.7_0.18_25)] transition-colors group-hover:bg-[oklch(0.55_0.22_25)]/20">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-bold text-white">{svc.title}</h3>
                <p className="mt-0.5 text-[11px] font-mono uppercase tracking-wider text-[oklch(0.65_0.22_25)]">
                  {svc.tagline}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">{svc.description}</p>

                {/* Divider */}
                <div className="my-5 h-px w-full bg-white/[0.06]" />

                {/* Features */}
                <ul className="space-y-1.5">
                  {svc.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/45">
                      <span className="h-1 w-1 rounded-full bg-[oklch(0.65_0.22_25)]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-sans text-sm font-semibold text-white/60 transition-colors hover:text-white"
          >
            View all services
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45 group-hover:text-[oklch(0.7_0.18_25)]" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
