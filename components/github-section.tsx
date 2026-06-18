"use client"

import { GithubCalendarWidget } from "./github-calendar-widget"
import { GithubActivity } from "./github-activity"

export function GithubSection() {
  return (
    <section id="github" className="w-full bg-[#0d1117] py-24 sm:py-32 flex justify-center border-y border-white/5 relative z-10">
      <div className="w-full max-w-[900px] px-4 sm:px-6">
        <GithubCalendarWidget />
        <GithubActivity />
      </div>
    </section>
  )
}
