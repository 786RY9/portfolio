"use client"

import { useEffect, useRef } from "react"

export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    let raf = 0
    let cx = 0
    let cy = 0
    let tx = 0
    let ty = 0

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      cx = e.clientX - (r.left + r.width / 2)
      cy = e.clientY - (r.top + r.height / 2)
      tx = cx * strength
      ty = cy * strength
    }
    const onLeave = () => {
      tx = 0
      ty = 0
    }
    const tick = () => {
      const cur = el.style.transform
      const m = cur.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px/)
      const px = m ? parseFloat(m[1]) : 0
      const py = m ? parseFloat(m[2]) : 0
      const nx = px + (tx - px) * 0.18
      const ny = py + (ty - py) * 0.18
      el.style.transform = `translate3d(${nx}px, ${ny}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
    }
  }, [strength])

  return ref
}
