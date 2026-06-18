"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * IntroOverlay
 * Minimal, clean intro sequence: Full black screen, name types in, red line draws across, 
 * then a curtain wipe up. Runs once per session.
 * BREAKING CHANGE: Completely replaces the old concentric rings/volumetric light intro.
 */
export function IntroOverlay() {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)

  const name = "Rashid Yaseen"

  useEffect(() => {
    setMounted(true)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const seen = sessionStorage.getItem("ry_intro_seen")
    
    if (reduced || seen) return
    
    setShow(true)
    document.body.style.overflow = "hidden"
    
    const t = setTimeout(() => {
      setShow(false)
      document.body.style.overflow = ""
      sessionStorage.setItem("ry_intro_seen", "1")
    }, 3800)
    
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ""
    }
  }, [])

  const skip = () => {
    setShow(false)
    document.body.style.overflow = ""
    sessionStorage.setItem("ry_intro_seen", "1")
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="presentation"
          onClick={skip}
          className="fixed inset-0 z-[99999] flex cursor-pointer flex-col items-center justify-center bg-black"
          initial={{ clipPath: "inset(0% 0 0% 0)" }}
          exit={{ clipPath: "inset(0% 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Typing Effect */}
          <div className="flex h-16 items-center">
            {name.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.05, delay: 0.5 + i * 0.08 }}
                className="font-serif italic text-4xl text-white md:text-6xl"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          {/* Red underline draw */}
          <motion.div 
            className="mt-4 h-[1.5px] bg-[#ff0030] drop-shadow-[0_0_8px_rgba(255,0,48,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: "160px" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 1.8 }}
          />

          {/* Skip hint */}
          <span className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Skip ↵
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
