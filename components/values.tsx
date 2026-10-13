"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

type Part = { text: string; bold?: boolean }
type Value = {
  num: string
  title: string
  image: string
  tilt: number
  description: Part[]
}

const VALUES: Value[] = [
  {
    num: "01",
    title: "Quality",
    image: "/values/01-quality.jpg",
    tilt: -7,
    description: [
      { text: "Quality and performance never happen by chance; they " },
      { text: "define every action we take", bold: true },
      { text: ". After all, " },
      { text: "excellence is the only thing", bold: true },
      { text: " that guarantees our long-term success." },
    ],
  },
  {
    num: "02",
    title: "Integrity",
    image: "/values/02-integrity.jpg",
    tilt: 6,
    description: [
      { text: "We believe that " },
      { text: "strong moral principles", bold: true },
      { text: " must exist in any " },
      { text: "field of activity", bold: true },
      { text: ", and the quality of being " },
      { text: "honest and open with clients", bold: true },
      { text: " defines us as a company." },
    ],
  },
  {
    num: "03",
    title: "Innovation",
    image: "/values/03-innovation.jpg",
    tilt: -6,
    description: [
      { text: "We don't follow trends, " },
      { text: "we set them", bold: true },
      { text: ". Every project is an opportunity to push boundaries, explore " },
      { text: "new technologies", bold: true },
      { text: ", and craft solutions that didn't exist yesterday." },
    ],
  },
  {
    num: "04",
    title: "Velocity",
    image: "/values/04-velocity.jpg",
    tilt: 7,
    description: [
      { text: "Speed is a feature. We " },
      { text: "ship fast", bold: true },
      { text: ", iterate faster, and treat momentum as a competitive advantage — without ever sacrificing the " },
      { text: "craft beneath the surface", bold: true },
      { text: "." },
    ],
  },
]

export function Values() {
  const sectionRef = useRef<HTMLElement>(null)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])
  const prevNumRef = useRef<HTMLDivElement>(null)
  const nextNumRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let raf = 0
    let ticking = false

    const update = () => {
      ticking = false
      const rect = section.getBoundingClientRect()
      const total = section.offsetHeight - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const progress = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0
      const activeFloat = progress * (VALUES.length - 1)
      const current = Math.round(activeFloat)

      slidesRef.current.forEach((el, i) => {
        if (!el) return
        const dist = i - activeFloat
        const abs = Math.abs(dist)
        // Tight visibility window so adjacent slide doesn't bleed in until current is gone
        const opacity = Math.max(0, 1 - Math.min(1, abs * 1.6))
        // Enter from below, exit upward
        const translateY = dist * 180 // px — larger throw for clearer separation
        const scale = 1 - Math.min(0.1, abs * 0.1)
        el.style.opacity = String(opacity)
        el.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`
        el.style.pointerEvents = opacity > 0.6 ? "auto" : "none"
      })

      // Greyed prev/next numerals around the active card
      const prevEl = prevNumRef.current
      const nextEl = nextNumRef.current
      const frac = activeFloat - current // -0.5..0.5
      if (prevEl) {
        const prev = VALUES[current - 1]
        prevEl.textContent = prev ? prev.num : ""
        const op = prev ? Math.max(0, Math.min(1, 1 - Math.abs(frac) * 0.5)) : 0
        prevEl.style.opacity = String(op)
      }
      if (nextEl) {
        const next = VALUES[current + 1]
        nextEl.textContent = next ? next.num : ""
        const op = next ? Math.max(0, Math.min(1, 1 - Math.abs(frac) * 0.5)) : 0
        nextEl.style.opacity = String(op)
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", update)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="values"
      className="relative bg-black"
      style={{ height: `${VALUES.length * 110}vh` }}
      aria-label="What I stand for"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Big bold heading */}
        <div className="pointer-events-none absolute left-1/2 top-3 z-30 -translate-x-1/2 whitespace-nowrap text-center font-black uppercase leading-none tracking-tight md:top-5">
          <motion.h2
            style={{ fontSize: "clamp(2rem, 6vw, 5.5rem)" }}
            initial={{ y: 40, opacity: 0, letterSpacing: "-0.08em", filter: "blur(12px)" }}
            whileInView={{ y: 0, opacity: 1, letterSpacing: "0em", filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-white">WHAT I STAND </span>
            <span style={{ color: "#ff0030", textShadow: "0 0 40px rgba(255,0,48,0.5)" }}>FOR</span>
          </motion.h2>
        </div>

        {/* Stacked slides */}
        <div className="absolute inset-0 z-10 grid grid-cols-12 items-center gap-6 px-6 md:px-12">
          {VALUES.map((v, i) => (
            <div
              key={v.num}
              ref={(el) => {
                slidesRef.current[i] = el
              }}
              className="col-span-12 grid grid-cols-12 items-center gap-6 will-change-transform"
              style={{ gridColumn: "1 / -1", gridRow: "1 / 2", opacity: 0 }}
            >
              {/* Left: title */}
              <div className="col-span-12 self-start md:col-span-3" style={{ paddingTop: "clamp(2rem, 8vh, 6rem)" }}>
                <h2
                  className="font-bold leading-none text-white"
                  style={{ fontSize: "clamp(2.25rem, 4.5vw, 4rem)" }}
                >
                  {v.title}
                </h2>
              </div>

              {/* Center: tilted card with neon number and circular corners */}
              <div className="col-span-12 flex justify-center md:col-span-6">
                <div
                  className="relative"
                  style={{
                    width: "min(440px, 70vw)",
                    aspectRatio: "1 / 1",
                    transform: `rotate(${v.tilt}deg)`,
                    transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <div
                    className="relative h-full w-full overflow-hidden"
                    style={{
                      borderRadius: "32px",
                      boxShadow:
                        "0 40px 100px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06), 0 0 60px -10px rgba(255,0,48,0.15)",
                    }}
                  >
                    <Image
                      src={v.image || "/placeholder.svg"}
                      alt={v.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 540px"
                      className="object-cover"
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/55" />
                    <div
                      className="absolute inset-0 flex items-center justify-center font-black tracking-tighter"
                      style={{
                        fontSize: "clamp(6rem, 14vw, 12rem)",
                        color: "#ff0030",
                        lineHeight: 1,
                        textShadow:
                          "0 0 14px #ff0030, 0 0 42px #ff0030, 0 0 90px rgba(204,0,32,0.9), 0 0 160px rgba(153,0,16,0.65)",
                      }}
                    >
                      {v.num}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: description */}
              <div
                className="col-span-12 flex justify-center self-start md:col-span-3 md:justify-start"
                style={{ paddingTop: "clamp(2rem, 8vh, 6rem)" }}
              >
                <p
                  className="text-center leading-[1.7] text-white/85 md:text-left"
                  style={{ fontSize: "13px", maxWidth: "280px" }}
                >
                  {v.description.map((part, idx) =>
                    part.bold ? (
                      <strong key={idx} className="font-bold text-white">
                        {part.text}
                      </strong>
                    ) : (
                      <span key={idx}>{part.text}</span>
                    ),
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Previous numeral above image */}
        <div
          ref={prevNumRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-20 select-none font-black uppercase tracking-tighter will-change-transform"
          style={{
            top: "calc(50% - min(440px, 70vw) / 2 - 1rem)",
            transform: "translate(-50%, -100%)",
            fontSize: "clamp(3rem, 6.5vw, 6rem)",
            color: "rgba(255,255,255,0.13)",
            lineHeight: 0.9,
            opacity: 0,
          }}
        />

        {/* Next numeral below image */}
        <div
          ref={nextNumRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 select-none font-black uppercase tracking-tighter will-change-transform"
          style={{
            top: "calc(50% + min(440px, 70vw) / 2 + 1rem)",
            fontSize: "clamp(3rem, 6.5vw, 6rem)",
            color: "rgba(255,255,255,0.13)",
            lineHeight: 0.9,
            opacity: 0,
          }}
        />
      </div>
    </section>
  )
}
