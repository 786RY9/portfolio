"use client"

import { motion, useScroll, useSpring } from "framer-motion"

/**
 * ScrollProgress
 * Pinned to the top of the viewport. Uses Framer Motion's useScroll
 * integrated with a spring for a buttery smooth 1.5px red-to-white gradient bar.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[9999] h-[1.5px] origin-left bg-gradient-to-r from-[#ff0030] to-white"
      style={{ scaleX }}
    />
  )
}
