"use client"

import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { useMagnetic } from "@/lib/use-magnetic"

export function Contact() {
  const emailBtnRef = useMagnetic<HTMLAnchorElement>(0.35)

  return (
    <section
      id="contact"
      className="relative bg-black overflow-hidden pt-32 sm:pt-40 lg:pt-56 pb-24"
    >
      {/* Soft red glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[70vh] w-[70vh] rounded-full bg-[oklch(0.55_0.22_25)]/25 blur-[180px]"
      />

      <div className="relative mx-auto max-w-[1500px] px-6">
        {/* Top eyebrow */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
            <span className="h-px w-10 bg-[oklch(0.55_0.22_25)]" />
            <span>Contact</span>
          </div>
          <div className="hidden md:flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">
              Available · Q2 2026
            </span>
          </div>
        </div>

        {/* Massive headline — magic5 style stacked */}
        <div className="relative">
          <h2
            className="font-serif italic font-black text-white tracking-[-0.04em] leading-[0.85] select-none"
            style={{ fontSize: "clamp(4rem, 16vw, 17rem)" }}
          >
            Let&apos;s
          </h2>
          <h2
            className="font-serif italic font-black tracking-[-0.04em] leading-[0.85] select-none -mt-2 sm:-mt-4"
            style={{
              fontSize: "clamp(4rem, 16vw, 17rem)",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(255,255,255,0.85)",
            }}
          >
            create
          </h2>
          <h2
            className="font-serif italic font-black text-[oklch(0.7_0.18_25)] tracking-[-0.04em] leading-[0.85] select-none -mt-2 sm:-mt-4"
            style={{ fontSize: "clamp(4rem, 16vw, 17rem)" }}
          >
            together.
          </h2>
        </div>

        {/* Big magnetic email pill */}
        <div className="mt-20 flex flex-col items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6">
            Drop a line — reply within 24h
          </p>
          <a
            ref={emailBtnRef}
            href="mailto:rashidyaseen5484@gmail.com"
            data-cursor="Email"
            className="group relative inline-flex items-center gap-4 sm:gap-6 rounded-full border border-white/15 bg-white/[0.02] px-8 sm:px-12 py-5 sm:py-7 backdrop-blur-md transition-colors hover:border-[oklch(0.55_0.22_25)] will-change-transform overflow-hidden"
          >
            {/* sweep highlight */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[oklch(0.55_0.22_25)]/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.18_25)] shadow-[0_0_18px_oklch(0.7_0.18_25)]" />
            <span className="relative font-serif italic text-white text-2xl sm:text-4xl lg:text-5xl">
              rashidyaseen5484@gmail.com
            </span>
            <ArrowUpRight className="relative h-7 w-7 sm:h-9 sm:w-9 text-white/70 transition-all duration-500 group-hover:rotate-45 group-hover:text-[oklch(0.7_0.18_25)]" />
          </a>
        </div>

      </div>
    </section>
  )
}
