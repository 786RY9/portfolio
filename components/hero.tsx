"use client"

import Image from "next/image"
import { Github, Linkedin, Twitter, Mail, Copy, Check } from "lucide-react"
import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"

const ROLES = [
  "Web App Developer",
  "Flutter Specialist",
  "ML & DL Engineer",
  "DevOps Engineer",
  "RAG / Agentic AI",
]

const EMAIL = "rashidyaseen5484@gmail.com"

export function Hero({ ready = false }: { ready?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const [roleIndex, setRoleIndex] = useState(0)
  const [menuHover, setMenuHover] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const el = document.createElement("textarea")
      el.value = EMAIL
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  // Tilt: drive CSS variables on the stage, no React re-renders.
  // Tilt & Background interactivity
  useEffect(() => {
    const stage = stageRef.current
    const circle = circleRef.current
    if (!stage || !circle) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      // 1. Tilt effect for portrait
      const rect = circle.getBoundingClientRect()
      const ccx = rect.left + rect.width / 2
      const ccy = rect.top + rect.height / 2
      const dx = (e.clientX - ccx) / (rect.width / 2)
      const dy = (e.clientY - ccy) / (rect.height / 2)
      const inside = dx * dx + dy * dy <= 1.4
      tx = inside ? -dx : 0
      ty = inside ? -dy : 0

      // 2. Interactive Spotlight for background
      const hero = document.getElementById("hero")
      if (hero) {
        hero.style.setProperty("--mouse-x", `${e.clientX}px`)
        hero.style.setProperty("--mouse-y", `${e.clientY}px`)
      }
    }
    const onLeave = () => {
      tx = 0
      ty = 0
    }
    const tick = () => {
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      stage.style.setProperty("--tx", cx.toFixed(4))
      stage.style.setProperty("--ty", cy.toFixed(4))
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mouseleave", onLeave)

    // Set initial mouse position to center
    const hero = document.getElementById("hero")
    if (hero) {
      hero.style.setProperty("--mouse-x", `${window.innerWidth / 2}px`)
      hero.style.setProperty("--mouse-y", `${window.innerHeight / 2}px`)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-black text-white"
      style={{ minHeight: "100vh" }}
    >
      {/* Interactive 3D Starfield & Nebula Glow */}
      <InteractiveStarfield />

      {/* Top-left hamburger */}
      <button
        type="button"
        aria-label="Open menu"
        onMouseEnter={() => setMenuHover(true)}
        onMouseLeave={() => setMenuHover(false)}
        className="group absolute left-6 top-7 z-30 flex flex-col gap-[7px] py-2"
        data-cursor="menu"
      >
        {[0, 1, 2, 3].map((i) => {
          const baseWidth = 56
          const isMiddle = i === 1 || i === 2
          const targetWidth = menuHover ? (isMiddle ? baseWidth / 2 : baseWidth) : baseWidth
          return (
            <span
              key={i}
              className="block h-px bg-white/90"
              style={{
                width: `${targetWidth}px`,
                transition: `width 420ms ${i * 60}ms cubic-bezier(0.22,1,0.36,1)`,
              }}
            />
          )
        })}
      </button>

      {/* Logo mark RY */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="absolute left-1/2 top-6 z-30 -translate-x-1/2"
      >
        <span className="font-serif italic text-3xl tracking-wide text-white">
          RY<span className="text-[oklch(0.65_0.22_25)]">.</span>
        </span>
      </motion.div>

      {/* Top right socials */}
      <motion.div 
        initial="hidden"
        animate={ready ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
        }}
        className="absolute right-6 top-6 z-30 flex items-center gap-5"
      >
        {[
          { Icon: Github, label: "GitHub", href: "https://github.com/786RY9" },
          { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/rashid-yaseen-7bb729294/" },
          { Icon: Twitter, label: "X", href: "https://x.com/ras_yaseen5484" },
          { Icon: Mail, label: "Email", href: "mailto:rashidyaseen5484@gmail.com" },
        ].map(({ Icon, label, href }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
            data-cursor={label}
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="text-white/85 transition-all duration-300 hover:text-white hover:-translate-y-0.5"
          >
            <Icon className="h-4 w-4" />
          </motion.a>
        ))}
      </motion.div>

      {/* Left vertical badge */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
        className="absolute left-7 top-1/2 z-30 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180"
      >
        <p className="font-sans text-xs font-bold uppercase tracking-[0.42em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Available for hire —{" "}
          <span className="text-[oklch(0.7_0.18_25)] animate-pulse">Open to work!</span>
        </p>
      </motion.div>

      {/* ─── AI ENGINEER vertical text — RIGHT SIDE ─── */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
        transition={{ duration: 1, ease: "easeOut", delay: 1.0 }}
        className="absolute right-6 top-1/2 z-20 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6"
      >
        <div className="[writing-mode:vertical-rl]">
          <p
            className="font-serif italic font-black uppercase select-none"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              letterSpacing: "0.2em",
              color: "rgba(255, 255, 255, 0.2)",
              WebkitTextStroke: "1px rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 20px rgba(255,255,255,0.4)",
            }}
          >
            AI ENGINEER
          </p>
        </div>
        {/* Scroll indicator integrated */}
        <div className="flex flex-col items-center gap-3">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [writing-mode:vertical-rl]">
            Scroll
          </span>
          <span className="relative block h-20 w-px overflow-hidden bg-white/20">
            <span className="absolute left-0 top-0 block h-1/3 w-px bg-white animate-[scrollLine_2s_ease-in-out_infinite]" />
          </span>
        </div>
      </motion.div>

      {/* Scroll indicator — mobile fallback (hidden on lg+) */}
      <div className="absolute right-8 top-1/2 z-30 -translate-y-1/2 flex flex-col items-center gap-3 lg:hidden">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="relative block h-20 w-px overflow-hidden bg-white/20">
          <span className="absolute left-0 top-0 block h-1/3 w-px bg-white animate-[scrollLine_2s_ease-in-out_infinite]" />
        </span>
      </div>

      {/* Center stage */}
      <div
        ref={stageRef}
        className="relative z-10 flex w-full items-center justify-center px-6 hero-stage"
        style={{ perspective: "1400px", minHeight: "100vh" }}
      >
        <div
          className="relative flex h-full w-full items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* RASHID — top */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[10%] z-[5] flex justify-center"
          >
            <h1
              className="hero-tilt-strong whitespace-nowrap font-serif font-black italic drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
              style={{
                fontSize: "clamp(3.5rem, 13vw, 11rem)",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                color: "rgba(255, 255, 255, 0.06)",
                WebkitTextStroke: "1px rgba(255, 255, 255, 0.35)",
                transformOrigin: "center center",
              }}
            >
              <SplitText text="RASHID" delay={0.4} ready={ready} />
            </h1>
          </div>

          {/* Circle wrapper — full viewport height */}
          <div
            ref={circleRef}
            className="relative flex items-end justify-center"
            style={{
              height: "min(92vh, 860px)",
              width: "min(92vh, 860px)",
            }}
          >
            <div
              aria-hidden
              className="hero-tilt-soft absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_65%)] animate-[archIn_1400ms_cubic-bezier(0.22,1,0.36,1)_both]"
            />

            <p
              className="hero-tilt-mid absolute left-1/2 top-[10%] z-[12] -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-[fadeIn_1400ms_900ms_ease-out_both]"
            >
              Sahiwal, Pakistan · Est. 2026
            </p>

            {/* Portrait image — taller to fill viewport */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(12px)" }}
              animate={ready ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : { opacity: 0, y: 50, scale: 0.95, filter: "blur(12px)" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="hero-tilt-portrait relative z-[15] w-auto"
              style={{ height: "min(88vh, 820px)" }}
            >
              <Image
                src="/portrait.png"
                alt="Rashid Yaseen portrait"
                width={520}
                height={780}
                priority
                className="h-full w-auto object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
              />
            </motion.div>

            {/* ─── EMAIL COPY BUTTON — right side of image ─── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
              className="absolute right-[-1rem] md:right-[-9rem] top-[45%] z-[20] -translate-y-1/2"
            >
              <button
                type="button"
                onClick={handleCopyEmail}
                data-cursor="email"
                className="group relative flex flex-col items-center gap-3"
              >
                {/* Pill button */}
                <div
                  className={`
                    relative overflow-hidden flex items-center gap-3 rounded-full border backdrop-blur-md px-5 py-3
                    transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform hover:scale-[1.02]
                    ${copied
                      ? "border-emerald-400/50 bg-emerald-400/10 shadow-[0_0_30px_rgba(52,211,153,0.2)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                    }
                  `}
                >
                  {/* Moving shine effect */}
                  <div className="absolute inset-0 -translate-x-full animate-[shine_4s_infinite] bg-gradient-to-r from-transparent via-white/4 to-transparent" />

                  <div className={`flex items-center justify-center rounded-full p-2 transition-colors duration-300 ${copied ? "bg-emerald-400/20" : "bg-white/5 group-hover:bg-[oklch(0.65_0.22_25)]/20"}`}>
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                    )}
                  </div>

                  <div className="flex flex-col items-start text-left">
                    <span className={`font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-300 ${copied ? "text-emerald-400" : "text-white/60 group-hover:text-white"
                      }`}>
                      {copied ? "Copied to clipboard!" : "Say Hello"}
                    </span>
                    <span className="font-mono text-xs text-white/90 group-hover:text-white transition-colors tracking-wide mt-0.5">
                      rashidyaseen5484@gmail.com
                    </span>
                  </div>
                </div>

                {/* Vertical connector line */}
                <span className="block h-10 w-px bg-gradient-to-b from-white/20 to-transparent group-hover:from-[oklch(0.65_0.22_25)]/50 transition-colors duration-500" />

                {/* Floating tooltip on hover */}
                <div className="absolute top-full mt-12 right-0 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                  <span className="font-mono text-[9px] text-white/60 uppercase tracking-[0.2em] bg-black/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 shadow-xl">
                    Click to copy
                  </span>
                </div>
              </button>
            </motion.div>
          </div>

          {/* YASEEN — bottom */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 bottom-[6%] z-[5] flex justify-center"
          >
            <h2
              className="hero-tilt-strong whitespace-nowrap font-serif font-black italic drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
              style={{
                fontSize: "clamp(3.5rem, 13vw, 11rem)",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                color: "rgba(255, 255, 255, 0.06)",
                WebkitTextStroke: "1px rgba(255, 255, 255, 0.35)",
                transformOrigin: "center center",
              }}
            >
              <SplitText text="YASEEN" delay={0.6} ready={ready} />
            </h2>
          </div>

          {/* Role rotator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
            className="hero-tilt-light absolute left-[15%] top-[45%] z-30 hidden md:block"
          >
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-white/80 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Currently
            </p>
            <div className="relative h-8 overflow-hidden">
              {ROLES.map((role, i) => (
                <p
                  key={role}
                  className="font-serif italic text-xl font-bold text-white absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    transform: `translateY(${(i - roleIndex) * 100}%)`,
                    opacity: i === roleIndex ? 1 : 0,
                    textShadow: i === roleIndex ? "0 2px 10px rgba(0,0,0,0.8), 0 0 30px rgba(255,255,255,0.3)" : "none",
                  }}
                >
                  {role}
                </p>
              ))}
            </div>
            <span className="mt-3 block h-[2px] w-16 bg-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </motion.div>

          {/* Tagline — BOTTOM */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.0 }}
            className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 max-w-2xl px-6 text-center"
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {["Web", "Flutter", "Machine Learning", "DevOps"].map((tag, i) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-3 font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-white/80" />}
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── HERO → NEXT SECTION TRANSITION GRADIENT ─── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20"
        style={{ height: "clamp(120px, 20vh, 250px)" }}
      >
        <div className="h-full w-full bg-gradient-to-b from-transparent via-black/60 to-black" />
      </div>

      <style jsx global>{`
        .hero-stage { --tx: 0; --ty: 0; }
        .hero-tilt-strong {
          transform: rotateY(calc(var(--tx) * 14deg)) rotateX(calc(var(--ty) * -11deg)) translateZ(60px);
          will-change: transform;
        }
        .hero-tilt-portrait {
          transform: rotateY(calc(var(--tx) * 10deg)) rotateX(calc(var(--ty) * -8deg)) translateZ(80px);
          will-change: transform;
        }
        .hero-tilt-mid {
          transform: translateX(-50%) rotateY(calc(var(--tx) * 7deg)) rotateX(calc(var(--ty) * -5deg)) translateZ(20px);
        }
        .hero-tilt-soft {
          transform: rotateY(calc(var(--tx) * 5deg)) rotateX(calc(var(--ty) * -4deg)) translateZ(-40px);
        }
        .hero-tilt-light {
          transform: rotateY(calc(var(--tx) * 4deg)) rotateX(calc(var(--ty) * -3deg)) translateZ(30px);
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes archIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes portraitIn {
          from { opacity: 0; transform: translateY(40px) scale(0.96); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes letterRise {
          from { opacity: 0; transform: translateY(60%) rotate(6deg); }
          to { opacity: 1; transform: translateY(0) rotate(0); }
        }
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(8%,-6%) scale(1.1);} 66%{transform:translate(-5%,8%) scale(0.95);} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(-10%,6%) scale(1.08);} 66%{transform:translate(6%,-7%) scale(0.92);} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(7%,-10%) scale(1.12);} }
        @keyframes blob4 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-9%,-5%) scale(0.9);} }
      `}</style>
    </section>
  )
}

function SplitText({ text, delay = 0, ready = false }: { text: string; delay?: number; ready?: boolean }) {
  return (
    <motion.span 
      className="inline-block"
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.07, delayChildren: delay }
        }
      }}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: "70%", rotate: 8 },
            visible: { 
              opacity: 1, 
              y: "0%", 
              rotate: 0, 
              transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } 
            }
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.span>
  )
}

function InteractiveStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const stars: { x: number; y: number; z: number; size: number; alpha: number; targetAlpha: number; hue: number }[] = []
    const numStars = 600

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        targetAlpha: Math.random(),
        hue: Math.random() > 0.8 ? 340 : 210
      })
    }

    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.5
      targetMouseY = (e.clientY - height / 2) * 0.5
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("resize", handleResize)

    let animationFrameId: number

    const render = () => {
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      // Deep space base background
      ctx.fillStyle = "#02000a"
      ctx.fillRect(0, 0, width, height)

      ctx.save()
      ctx.translate(width / 2, height / 2)

      for (let i = 0; i < numStars; i++) {
        const star = stars[i]
        star.z -= 0.6 // Speed of moving forward
        if (star.z <= 0) {
          star.z = width
          star.x = (Math.random() - 0.5) * width * 2
          star.y = (Math.random() - 0.5) * height * 2
        }

        const k = 120 / star.z
        const px = star.x * k - mouseX * (k * 0.5)
        const py = star.y * k - mouseY * (k * 0.5)

        star.alpha += (star.targetAlpha - star.alpha) * 0.05
        if (Math.abs(star.alpha - star.targetAlpha) < 0.05) {
          star.targetAlpha = Math.random()
        }

        const size = star.size * k

        if (px > -width / 2 && px < width / 2 && py > -height / 2 && py < height / 2) {
          ctx.beginPath()
          ctx.arc(px, py, size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${star.hue}, 80%, 80%, ${star.alpha})`
          ctx.fill()
        }
      }
      ctx.restore()

      // Central ambient nebula glow to improve lighting
      const gradient = ctx.createRadialGradient(
        width / 2 - mouseX * 0.2,
        height / 2 - mouseY * 0.2,
        0,
        width / 2,
        height / 2,
        height * 0.8
      )
      gradient.addColorStop(0, "rgba(255, 0, 76, 0.15)") // Bright red/pink accent in center
      gradient.addColorStop(0.4, "rgba(30, 0, 80, 0.08)") // Mid purple transition
      gradient.addColorStop(1, "transparent")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Add a subtle top overlay so the header is always readable
      const topGradient = ctx.createLinearGradient(0, 0, 0, height * 0.2)
      topGradient.addColorStop(0, "rgba(2, 0, 10, 0.8)")
      topGradient.addColorStop(1, "transparent")
      ctx.fillStyle = topGradient
      ctx.fillRect(0, 0, width, height * 0.2)

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  )
}

