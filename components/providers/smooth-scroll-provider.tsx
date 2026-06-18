"use client"

import { ReactNode, useEffect } from "react"
import Lenis from "lenis"
import { cancelFrame, frame } from "framer-motion"

/**
 * SmoothScrollProvider
 * Initializes global smooth scrolling via Lenis.
 * BREAKING CHANGE: Native smooth-scrolling CSS (scroll-behavior: smooth) 
 * will be overridden by Lenis. Replaces manual rAF with Framer Motion's frame.update.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    const update = (time: { timestamp: number }) => {
      // In older Framer Motion versions, time was a number. In newer versions, 
      // it passes an object with timestamp and delta. We handle both for safety.
      const timestamp = typeof time === 'number' ? time : time.timestamp;
      lenis.raf(timestamp)
    }

    // Sync Lenis with Framer Motion's update loop
    frame.update(update, true)

    return () => {
      cancelFrame(update)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
