"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from "framer-motion"

const PILLARS = ["PRECISION", "CRAFT", "PERFORMANCE", "SHIP", "SCALE", "TASTE"]

export function Pillars() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLDivElement | null)[]>([])
  const fillRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" })
  const [distance, setDistance] = useState(0)

  // Measure track width
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setDistance(trackRef.current.scrollWidth - window.innerWidth)
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // Hook into Framer Motion's synchronized scroll pipeline
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  // Update fills smoothly when scroll (x) changes
  useMotionValueEvent(x, "change", () => {
    const center = window.innerWidth / 2
    const max = window.innerWidth * 0.6
    
    for (let i = 0; i < wordRefs.current.length; i++) {
      const el = wordRefs.current[i]
      const fill = fillRefs.current[i]
      if (!el || !fill) continue
      
      const r = el.getBoundingClientRect()
      const wordCenter = r.left + r.width / 2
      const dist = Math.abs(wordCenter - center)
      const t = Math.max(0, Math.min(1, 1 - dist / max))
      
      fill.style.clipPath = `inset(0 ${(1 - t) * 100}% 0 0)`
      el.style.opacity = String(0.18 + t * 0.82)
    }
  })

  return (
    <section
      ref={sectionRef}
      id="pillars"
      className="relative bg-black"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* label */}
        <div className="absolute left-6 top-8 z-10 overflow-hidden">
          <motion.div 
            className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50"
            initial={{ x: "-110%" }}
            animate={isInView ? { x: 0 } : { x: "-110%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="h-px w-8 bg-[oklch(0.55_0.22_25)]" />
            <span>// Ethos</span>
          </motion.div>
        </div>
        <div className="absolute right-6 top-8 z-10 overflow-hidden py-1">
          <motion.div 
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/50"
            initial={{ x: "110%" }}
            animate={isInView ? { x: 0 } : { x: "110%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            What I stand for
          </motion.div>
        </div>

        <div className="flex h-full items-center">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex items-center gap-[8vw] whitespace-nowrap pl-[20vw] pr-[20vw] will-change-transform"
          >
            {PILLARS.map((word, i) => (
              <div
                key={word}
                ref={(el) => {
                  wordRefs.current[i] = el
                }}
                className="relative inline-flex items-center gap-6"
                style={{ opacity: 0.18 }}
              >
                <span className="font-mono text-sm text-[oklch(0.55_0.22_25)]">
                  ({String(i + 1).padStart(2, "0")})
                </span>
                <div className="relative">
                  {/* Outline / dim */}
                  <span
                    className="font-serif italic font-black text-transparent"
                    style={{
                      fontSize: "clamp(6rem, 16vw, 18rem)",
                      lineHeight: 0.9,
                      letterSpacing: "-0.04em",
                      WebkitTextStroke: "1px rgba(255,255,255,0.18)",
                    }}
                  >
                    {word}
                  </span>
                  {/* Filled overlay */}
                  <div
                    ref={(el) => {
                      fillRefs.current[i] = el
                    }}
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: "inset(0 100% 0 0)" }}
                  >
                    <span
                      className="font-serif italic font-black text-white"
                      style={{
                        fontSize: "clamp(6rem, 16vw, 18rem)",
                        lineHeight: 0.9,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {word}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
          Scroll →
        </div>
      </div>
    </section>
  )
}
