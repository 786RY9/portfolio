"use client"

import { useState } from "react"
import { Loader } from "@/components/loader"
import { Hero } from "@/components/hero"
import { Values } from "@/components/values"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { GithubSection } from "@/components/github-section"
import { Feedback } from "@/components/feedback"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Cursor } from "@/components/cursor"

export default function Page() {
  const [loading, setLoading] = useState(true)

  return (
    <main className="bg-black text-white">
      {loading && <Loader onFinish={() => setLoading(false)} />}
      <SmoothScroll />
      <Cursor />
      <Hero ready={!loading} />
      <Values />
      <Skills />
      <Projects />
      <GithubSection />
      <Feedback />
      <Contact />
      <Footer />
    </main>
  )
}
