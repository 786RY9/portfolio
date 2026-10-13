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
        <div className="mt-20 flex flex-col items-center gap-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
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

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/923027530487"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-8 py-4 text-base font-semibold text-[#25D366] transition-all hover:bg-[#25D366]/20 hover:border-[#25D366]/50 hover:scale-105"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Message on WhatsApp
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </a>
        </div>

      </div>
    </section>
  )
}
