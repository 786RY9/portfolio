"use client"

import { useEffect, useRef, useState } from "react"

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const arrowRef = useRef<SVGSVGElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (!canHover) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    const labelEl = labelRef.current
    const arrowEl = arrowRef.current
    if (!dot || !ring || !labelEl || !arrowEl) return

    document.documentElement.classList.add("has-custom-cursor")

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0
    let mode: "default" | "interactive" | "label" = "default"
    let curLabel: string | null = null

    const setMode = (next: "default" | "interactive" | "label", lbl: string | null) => {
      if (next === mode && lbl === curLabel) return
      mode = next
      curLabel = lbl
      if (next === "default") {
        ring.style.width = "30px"
        ring.style.height = "30px"
        ring.style.borderColor = "rgba(255,255,255,0.6)"
        ring.style.borderWidth = "1px"
        labelEl.style.opacity = "0"
        labelEl.textContent = ""
        arrowEl.style.opacity = "0"
        dot.style.opacity = "1"
      } else if (next === "interactive") {
        ring.style.width = "44px"
        ring.style.height = "44px"
        ring.style.borderColor = "rgba(255,255,255,0.95)"
        ring.style.borderWidth = "1.5px"
        labelEl.style.opacity = "0"
        labelEl.textContent = ""
        arrowEl.style.opacity = "1"
        dot.style.opacity = "0"
      } else {
        // label mode (data-cursor with text)
        ring.style.width = "82px"
        ring.style.height = "82px"
        ring.style.borderColor = "rgba(255,255,255,0.95)"
        ring.style.borderWidth = "1.5px"
        if (lbl) {
          labelEl.textContent = lbl
          labelEl.style.opacity = "1"
        }
        arrowEl.style.opacity = "0"
        dot.style.opacity = "0"
      }
    }

    const move = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`

      const t = e.target as HTMLElement | null
      const interactive = t?.closest(
        "a, button, [data-cursor], input, textarea, [role=button]"
      ) as HTMLElement | null
      if (!interactive) {
        setMode("default", null)
        return
      }
      const lbl = interactive.getAttribute("data-cursor")
      if (lbl && lbl.trim().length > 0) {
        setMode("label", lbl)
      } else {
        setMode("interactive", null)
      }
    }

    const tick = () => {
      rx += (mx - rx) * 0.2
      ry += (my - ry) * 0.2
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
    raf = requestAnimationFrame(tick)

    window.addEventListener("mousemove", move, { passive: true })
    return () => {
      window.removeEventListener("mousemove", move)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove("has-custom-cursor")
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 rounded-full bg-white"
        style={{ mixBlendMode: "difference", transition: "opacity 200ms ease" }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[199] flex items-center justify-center rounded-full"
        style={{
          width: 30,
          height: 30,
          border: "1px solid rgba(255,255,255,0.6)",
          mixBlendMode: "difference",
          backgroundColor: "transparent",
          transition:
            "width 320ms cubic-bezier(0.22,1,0.36,1), height 320ms cubic-bezier(0.22,1,0.36,1), border-color 320ms ease, border-width 320ms ease",
        }}
      >
        <svg
          ref={arrowRef}
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
          style={{ opacity: 0, transition: "opacity 240ms ease" }}
          aria-hidden
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
        <span
          ref={labelRef}
          className="absolute font-mono text-[10px] uppercase tracking-[0.2em] text-white"
          style={{ opacity: 0, transition: "opacity 220ms ease" }}
        />
      </div>
    </>
  )
}
