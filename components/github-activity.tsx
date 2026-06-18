"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type RepoMap = Record<string, number>

export function GithubActivity() {
  const [loading, setLoading] = useState(true)
  const [commits, setCommits] = useState<{ repo: string; count: number }[]>([])
  const [repos, setRepos] = useState<{ name: string; date: string }[]>([])
  const [totalCommits, setTotalCommits] = useState(0)

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("https://api.github.com/users/786RY9/events")
        if (!res.ok) throw new Error("Rate limited")
        const data = await res.json()
        
        const pushEvents = data.filter((e: any) => e.type === "PushEvent")
        const createEvents = data.filter((e: any) => e.type === "CreateEvent" && e.payload.ref_type === "repository")
        
        const repoCommits: RepoMap = {}
        let tCommits = 0
        pushEvents.forEach((e: any) => {
          const count = e.payload.commits?.length || 0
          if (count > 0) {
            repoCommits[e.repo.name] = (repoCommits[e.repo.name] || 0) + count
            tCommits += count
          }
        })
        
        const sortedCommits = Object.entries(repoCommits)
          .map(([repo, count]) => ({ repo, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) // Top 5
          
        const recentRepos = createEvents.map((e: any) => {
          const d = new Date(e.created_at)
          return {
            name: e.repo.name,
            date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }
        }).slice(0, 3) // Top 3
        
        setCommits(sortedCommits)
        setTotalCommits(tCommits)
        setRepos(recentRepos)
      } catch (e) {
        // Fallback data if rate limited (mimicking the screenshot)
        setCommits([
          { repo: "786RY9/innergy-care", count: 6 },
          { repo: "786RY9/ThreatX_Malware_Detector", count: 1 }
        ])
        setTotalCommits(7)
        setRepos([
          { name: "786RY9/v0-video-storyboard-for-threatx", date: "May 9" },
          { name: "786RY9/ThreatX_Malware_Detector", date: "May 3" }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchActivity()
  }, [])

  if (loading) return <div className="h-40 animate-pulse bg-white/5 rounded-xl mt-8"></div>

  return (
    <div className="mt-8 font-sans text-white">
      <h3 className="text-base font-normal mb-6">Contribution activity</h3>
      
      <div className="relative pl-8 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-px before:bg-white/10">
        
        {/* Commits Section */}
        {commits.length > 0 && (
          <div className="mb-10 relative">
            <div className="absolute -left-[37px] top-1 h-6 w-6 rounded-full bg-[#161b22] border border-white/10 flex items-center justify-center">
              <svg aria-hidden="true" height="12" viewBox="0 0 16 16" version="1.1" width="12" fill="currentColor" className="text-white/70">
                <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5h-3.32Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
              </svg>
            </div>
            <h4 className="text-base font-medium flex items-center justify-between">
              Created {totalCommits} commits in {commits.length} repositories
              <span className="text-white/40 cursor-pointer">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor">
                  <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1-1.06 1.06l-2.97-2.97V14.5a.75.75 0 0 1-1.5 0V5.31L5.03 8.28a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"></path>
                </svg>
              </span>
            </h4>
            <div className="mt-4 flex flex-col gap-3">
              {commits.map(c => {
                const percentage = Math.max(10, Math.min(100, (c.count / totalCommits) * 100))
                return (
                  <div key={c.repo} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <a href={`https://github.com/${c.repo}`} target="_blank" rel="noreferrer" className="text-[#58a6ff] hover:underline font-semibold">
                        {c.repo}
                      </a>
                      <span className="text-white/50 text-xs">{c.count} commits</span>
                    </div>
                    <div className="w-32 bg-transparent rounded-full h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-[#238636] h-full rounded-full"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Repos Section */}
        {repos.length > 0 && (
          <div className="relative">
            <div className="absolute -left-[37px] top-1 h-6 w-6 rounded-full bg-[#161b22] border border-white/10 flex items-center justify-center">
              <svg aria-hidden="true" height="12" viewBox="0 0 16 16" version="1.1" width="12" fill="currentColor" className="text-white/70">
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7A.25.25 0 0 1 5 15.5Z"></path>
              </svg>
            </div>
            <h4 className="text-base font-medium flex items-center justify-between">
              Created {repos.length} repositories
              <span className="text-white/40 cursor-pointer">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor">
                  <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1-1.06 1.06l-2.97-2.97V14.5a.75.75 0 0 1-1.5 0V5.31L5.03 8.28a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"></path>
                </svg>
              </span>
            </h4>
            <div className="mt-4 flex flex-col gap-3">
              {repos.map(r => (
                <div key={r.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor" className="text-white/50">
                      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7A.25.25 0 0 1 5 15.5Z"></path>
                    </svg>
                    <a href={`https://github.com/${r.name}`} target="_blank" rel="noreferrer" className="text-[#58a6ff] hover:underline font-semibold">
                      {r.name}
                    </a>
                  </div>
                  <div className="text-white/50 text-xs text-right min-w-[60px]">{r.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <button className="w-full mt-6 py-3 rounded-xl border border-white/10 hover:border-white/20 transition-colors text-sm font-semibold text-[#58a6ff]">
        Show more activity
      </button>
    </div>
  )
}
