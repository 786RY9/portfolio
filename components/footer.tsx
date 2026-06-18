"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { useMagnetic } from "@/lib/use-magnetic"

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/786RY9" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rashid-yaseen-7bb729294/" },
  { label: "Twitter / X", href: "https://x.com/ras_yaseen5484" },
  { label: "Instagram", href: "https://www.instagram.com/" },
]

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState("")

  useEffect(() => {
    const fmt = () => {
      const d = new Date()
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
      setTime(new Intl.DateTimeFormat("en-GB", opts).format(d))
    }
    fmt()
    const id = setInterval(fmt, 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const el = ref.current
    const wrap = nameRef.current
    if (!el || !wrap) return

    let raf = 0
    let mx = -9999
    let my = -9999
    let curX = -9999
    let curY = -9999
    let lit = 0
    let litTarget = 0
    let baseOpacity = 0
    let inViewTarget = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    const onEnter = () => {
      litTarget = 1
    }
    const onLeave = () => {
      litTarget = 0
    }

    const tick = () => {
      // Lerp cursor and lit value for smooth motion
      curX += (mx - curX) * 0.18
      curY += (my - curY) * 0.18
      lit += (litTarget - lit) * 0.1

      // Lerp base opacity with a pulsing/breathing modulation when in view
      const targetOpacity = inViewTarget ? (Math.sin(Date.now() * 0.002) * 0.03 + 0.13) : 0
      baseOpacity += (targetOpacity - baseOpacity) * 0.08

      const rect = wrap.getBoundingClientRect()
      const localX = curX - rect.left
      const localY = curY - rect.top

      wrap.style.setProperty("--mx", `${localX}px`)
      wrap.style.setProperty("--my", `${localY}px`)
      wrap.style.setProperty("--lit", lit.toFixed(3))
      wrap.style.setProperty("--base-opacity", baseOpacity.toFixed(3))

      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewTarget = entry.isIntersecting ? 1 : 0
      },
      { threshold: 0.05 }
    )
    observer.observe(wrap)

    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
    window.addEventListener("mousemove", onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      observer.disconnect()
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <footer ref={ref} className="relative bg-black overflow-hidden">

      {/* ── Editorial Masthead Section ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1500px] px-6 pt-28 md:pt-36">

          {/* Full-width headline with mixed typography */}
          <div className="relative mb-20 md:mb-28">
            {/* Ambient glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/4 -top-24 h-[400px] w-[600px] rounded-full bg-[oklch(0.50_0.20_25)]/[0.06] blur-[150px]"
            />
            <h2 className="relative">
              <span
                className="block font-sans font-black text-white leading-[0.88] tracking-[-0.045em]"
                style={{ fontSize: "clamp(3rem, 7vw, 7.5rem)" }}
              >
                What is sleep, and
              </span>
              <span
                className="block font-sans font-black leading-[0.88] tracking-[-0.045em] mt-1"
                style={{
                  fontSize: "clamp(3rem, 7vw, 7.5rem)",
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.5)",
                }}
              >
                why is it important,
              </span>
              <span
                className="block font-sans font-black text-white leading-[0.88] tracking-[-0.045em] mt-1"
                style={{ fontSize: "clamp(3rem, 7vw, 7.5rem)" }}
              >
                and what is{" "}
                <span className="text-[oklch(0.62_0.24_25)]">it?</span>
              </span>
            </h2>
          </div>

          {/* ── Horizontal dateline strip ── */}
          <div className="border-t border-white/10">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.07]">
              <InfoCell
                label="Location"
                value="Sahiwal, Pakistan"
              />
              <InfoCell
                label="Local Time"
                value={time ? `${time} PKT` : "--:-- PKT"}
                mono
                live
              />
              <InfoCell
                label="Calendar"
                value="Book a 30-min call"
                href="mailto:rashidyaseen5484@gmail.com?subject=Booking%20a%20call"
              />
              <InfoCell
                label="Resume"
                value="Download (PDF)"
                href="#"
              />
            </div>
          </div>

          {/* ── Socials bar ── */}
          <div className="border-t border-white/[0.07] py-6 flex flex-wrap items-center justify-between gap-y-4">
            <div className="flex items-center gap-8">
              <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/25">
                Connect
              </span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {SOCIALS.map((s) => (
                  <SocialLink key={s.label} {...s} />
                ))}
              </div>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/20">
              © {new Date().getFullYear()} Rashid Yaseen
            </span>
          </div>

        </div>
      </div>


      {/* MASSIVE EDGE-TO-EDGE WORDMARK with cursor spotlight */}
      <div
        ref={nameRef}
        className="footer-name relative w-full select-none whitespace-nowrap leading-none"
        aria-label="Rashid Yaseen"
        style={
          {
            fontFamily: "var(--font-sans, system-ui), sans-serif",
            fontWeight: 900,
            letterSpacing: "-0.055em",
            fontSize: "clamp(2.5rem, 11.5vw, 16rem)",
            paddingLeft: "1vw",
            paddingRight: "1vw",
            paddingBottom: "0.4vw",
            "--mx": "-9999px",
            "--my": "-9999px",
            "--lit": 0,
            "--base-opacity": 0,
          } as React.CSSProperties
        }
      >
        <span className="footer-name-text">
          RASHID YASEE<span className="footer-name-red">N</span>
        </span>
      </div>

      {/* Scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 1px, transparent 1px, transparent 4px)",
        }}
      />

      <style jsx>{`
        .footer-name {
          -webkit-mask-image: radial-gradient(
            circle calc(var(--lit) * 600px) at var(--mx) var(--my),
            #000 0%,
            rgba(0, 0, 0, 0.8) 35%,
            rgba(0, 0, 0, var(--base-opacity)) 100%
          );
          mask-image: radial-gradient(
            circle calc(var(--lit) * 600px) at var(--mx) var(--my),
            #000 0%,
            rgba(0, 0, 0, 0.8) 35%,
            rgba(0, 0, 0, var(--base-opacity)) 100%
          );
          will-change: -webkit-mask-image, mask-image;
        }
        .footer-name-text {
          color: #ffffff;
          display: inline-block;
          width: 100%;
          text-align: justify;
          text-align-last: justify;
          text-shadow: 0 0 60px rgba(255, 255, 255, 0.35);
        }
        .footer-name-red {
          color: oklch(0.62 0.24 25);
          text-shadow:
            0 0 40px oklch(0.65 0.24 25 / 0.65),
            0 0 90px oklch(0.55 0.24 25 / 0.45);
        }
      `}</style>
    </footer>
  )
}

/* ── Dateline Info Cell ───────────────────────────────────── */
function InfoCell({
  label,
  value,
  href,
  mono,
  live,
}: {
  label: string
  value: string
  href?: string
  mono?: boolean
  live?: boolean
}) {
  const Tag: "a" | "div" = href ? "a" : "div"
  return (
    <div className="group relative py-7 px-5 lg:px-8 transition-colors duration-500 hover:bg-white/[0.02]">
      <div className="flex items-center gap-2 mb-3">
        {live && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
        )}
        <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/30 transition-colors duration-400 group-hover:text-white/50">
          {label}
        </p>
      </div>
      <Tag
        {...(href ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" } : {})}
        className={`block text-white font-sans font-bold text-base sm:text-lg tracking-[-0.01em] transition-colors duration-300 ${
          mono ? "font-mono tabular-nums !font-medium tracking-normal" : ""
        } ${href ? "hover:text-[oklch(0.7_0.18_25)]" : ""}`}
      >
        {value}
        {href && (
          <ArrowUpRight className="inline-block ml-1.5 h-3.5 w-3.5 text-white/30 transition-all duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[oklch(0.7_0.18_25)]" />
        )}
      </Tag>
    </div>
  )
}

/* ── Social Link ─────────────────────────────────────────── */
function SocialLink({ label, href }: { label: string; href: string }) {
  const r = useMagnetic<HTMLAnchorElement>(0.18)
  return (
    <a
      ref={r}
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative inline-flex items-center gap-1 font-sans font-semibold tracking-tight text-white/60 text-sm will-change-transform transition-colors duration-300 hover:text-white"
    >
      <span className="relative">
        {label}
        <span className="absolute left-0 -bottom-px h-px w-full bg-[oklch(0.7_0.18_25)] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
      </span>
      <ArrowUpRight className="h-3 w-3 text-white/30 transition-all duration-500 group-hover:rotate-45 group-hover:text-[oklch(0.7_0.18_25)]" />
    </a>
  )
}
