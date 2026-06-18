"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

/**
 * CustomCursor
 * Global interactive cursor with a solid dot and a trailing ring driven by Spring physics.
 * BREAKING CHANGE: Requires CSS `cursor-none` on body or interactive elements 
 * if you want to completely replace the native cursor (not enforced globally here 
 * to preserve accessibility defaults, but recommended for full effect).
 */
export function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Cursor coordinates
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Smooth springs for the ring
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.1 })
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.1 })

  useEffect(() => {
    // Detect touch device to hide cursor
    const checkTouch = () => {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches)
    }
    checkTouch()
    window.addEventListener("resize", checkTouch)

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Detect interactive elements
      const isInteractive = target.closest(
        'a, button, [data-cursor="hover"], [data-cursor="email"], input, textarea'
      )
      setIsHovering(!!isInteractive)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseover", onMouseOver)

    return () => {
      window.removeEventListener("resize", checkTouch)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseover", onMouseOver)
    }
  }, [mouseX, mouseY])

  if (isTouch) return null

  return (
    <>
      {/* Small dot (instant) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
        style={{ x: mouseX, y: mouseY }}
        animate={{
          opacity: isHovering ? 0 : 1,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Outer ring (delayed/spring) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 backdrop-blur-[1px]"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: isHovering ? 0.6 : 1,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)",
          borderColor: isHovering ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 0.4)",
          mixBlendMode: isHovering ? "difference" : "normal"
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  )
}
