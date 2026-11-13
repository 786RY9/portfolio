import { Hero } from "@/components/hero"
import { Values } from "@/components/values"
import { Skills } from "@/components/skills"
import { SelectedProjects } from "@/components/selected-projects"
import { Experience } from "@/components/experience"
import { Services } from "@/components/services"
// import { GithubSection } from "@/components/github-section"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Cursor } from "@/components/cursor"

// Server component: every section is server-rendered and visible without waiting
// for the intro loader (which lives in app/layout.tsx and only overlays the page).
export default function Page() {
  return (
    <main className="bg-black text-white">
      <SmoothScroll />
      <Cursor />
      <Hero />
      <Values />
      <Skills />
      <SelectedProjects />
      <Experience />
      <Services />
      {/* <GithubSection /> */}
      <Contact />
      <Footer />
    </main>
  )
}
