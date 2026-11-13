"use client"

import { useEffect, useState } from "react"
import { INTRO_COUNT_MS as COUNT_MS, INTRO_TOTAL_MS as TOTAL_MS } from "@/lib/intro"

/**
 * Intro loader: plays at most once per browser session, only on a hard landing
 * on "/", never with prefers-reduced-motion, and lasts ~1.15s.
 *
 * The decision is made before first paint by INTRO_SCRIPT (lib/intro.ts, inlined
 * in <head>), which sets <html data-intro="play">. CSS (app/globals.css,
 * ".intro-loader") shows the overlay and drives its timing, so it still exits on
 * time even if hydration is slow, and stays hidden entirely when JavaScript is off.
 * The page underneath is fully server-rendered and never waits on this.
 */
const RING_CIRCUMFERENCE = 2 * Math.PI * 195

export function Loader() {
  const [active, setActive] = useState(true)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const root = document.documentElement
    if (root.getAttribute("data-intro") !== "play") {
      setActive(false)
      return
    }

    const start: number =
      (window as unknown as { __ryIntroStart?: number }).__ryIntroStart ?? performance.now()

    let raf = 0
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / COUNT_MS)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    document.body.style.overflow = "hidden"
    const remaining = Math.max(0, TOTAL_MS - (performance.now() - start))
    const done = setTimeout(() => {
      root.setAttribute("data-intro", "done")
      document.body.style.overflow = ""
      setActive(false)
    }, remaining)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(done)
      document.body.style.overflow = ""
    }
  }, [])

  if (!active) return null

  const circularText = "RASHID YASEEN ★ ML · FULL-STACK AI ★ "

  return (
    <div aria-hidden className="intro-loader fixed inset-0 z-[100] items-center justify-center bg-black">
      <div className="relative flex h-[420px] w-[420px] items-center justify-center max-sm:scale-[0.8]">
        <div className="absolute inset-0 rounded-full bg-neutral-950" />

        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full animate-[spin_8s_linear_infinite]"
        >
          <defs>
            <path
              id="loader-circle"
              d="M 200,200 m -150,0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0"
            />
          </defs>
          <text
            fill="#f5f5f5"
            className="font-serif"
            style={{ fontSize: 32, letterSpacing: "0.08em", fontWeight: 700 }}
          >
            {/* One copy stretched to exactly the circle's circumference (2π·150) so the ring closes seamlessly */}
            <textPath href="#loader-circle" startOffset="0" textLength={942} lengthAdjust="spacing">
              {circularText}
            </textPath>
          </text>
        </svg>

        {/* Inner red core with RY */}
        <div className="relative z-10 flex h-[140px] w-[140px] items-center justify-center rounded-full bg-[oklch(0.55_0.22_25)] shadow-[0_0_80px_rgba(220,40,40,0.55)]">
          <span className="font-serif italic text-4xl font-black text-white tracking-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]">
            RY
          </span>
        </div>

        {/* Progress ring (CSS-animated, see .intro-loader-ring) */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="200" cy="200" r="195" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <circle
            cx="200"
            cy="200"
            r="195"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            strokeDasharray={RING_CIRCUMFERENCE}
            className="intro-loader-ring"
            style={{ ["--ring" as string]: `${RING_CIRCUMFERENCE}` }}
          />
        </svg>

        {/* Counter */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.5em] text-white/60">
          <span className="text-white/90">{String(count).padStart(3, "0")}</span>
          <span className="text-white/30"> / 100</span>
        </div>

        {/* Top label */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.5em] text-white/50">
          Loading Portfolio
        </div>
      </div>
    </div>
  )
}
