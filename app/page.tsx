"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { Values } from "@/components/values"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Services } from "@/components/services"
import { GithubSection } from "@/components/github-section"
import { Feedback } from "@/components/feedback"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Page() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem("ry_intro_seen")) {
      setReady(true)
      return
    }
    const onFinish = () => setReady(true)
    window.addEventListener("ry_intro_finish", onFinish)
    const timer = setTimeout(() => setReady(true), 4200)
    return () => {
      window.removeEventListener("ry_intro_finish", onFinish)
      clearTimeout(timer)
    }
  }, [])

  return (
    <main className="bg-black text-white w-full max-w-full overflow-x-hidden">
      <Hero ready={ready} />
      <Values />
      <Skills />
      <Projects />
      <Services />
      <GithubSection />
      <Feedback />
      <Contact />
      <Footer />
    </main>
  )
}
