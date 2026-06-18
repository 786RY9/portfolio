"use client"

import { useEffect, useState } from "react"

interface LoaderProps {
  onFinish: () => void
}

export function Loader({ onFinish }: LoaderProps) {
  const [exiting, setExiting] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const dur = 2400
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const exitTimer = setTimeout(() => setExiting(true), 2700)
    const finishTimer = setTimeout(() => onFinish(), 3500)
    document.body.style.overflow = "hidden"
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(exitTimer)
      clearTimeout(finishTimer)
      document.body.style.overflow = ""
    }
  }, [onFinish])

  const circularText =
    "RASHID YASEEN  \u2605  DEVELOPER \u00B7 ML \u00B7 DEVOPS  \u2605  "

  return (
    <div
      aria-hidden={exiting}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      style={{
        clipPath: exiting ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
        transition: "clip-path 900ms cubic-bezier(0.86, 0, 0.07, 1)",
      }}
    >
      <div className="relative h-[420px] w-[420px] flex items-center justify-center">
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
            <textPath href="#loader-circle" startOffset="0">
              {circularText + circularText}
            </textPath>
          </text>
        </svg>

        {/* Inner red core with RY */}
        <div className="relative z-10 flex h-[140px] w-[140px] items-center justify-center rounded-full bg-[oklch(0.55_0.22_25)] shadow-[0_0_80px_rgba(220,40,40,0.55)]">
          <span className="font-serif italic text-4xl font-black text-white tracking-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]">
            RY
          </span>
        </div>

        {/* Progress ring */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full -rotate-90"
        >
          <circle
            cx="200"
            cy="200"
            r="195"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="200"
            r="195"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            strokeDasharray={2 * Math.PI * 195}
            strokeDashoffset={(1 - count / 100) * 2 * Math.PI * 195}
            style={{ transition: "stroke-dashoffset 80ms linear" }}
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
