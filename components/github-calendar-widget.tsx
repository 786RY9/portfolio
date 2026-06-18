"use client"

import { useState, useEffect } from "react"
import { GitHubCalendar } from "react-github-calendar"
import { motion, AnimatePresence } from "framer-motion"

const YEARS = [2026, 2025, 2024, 2023, 2022]

export function GithubCalendarWidget() {
  const [activeYear, setActiveYear] = useState<number>(2026)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const customTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start font-sans">
      {/* Calendar Block */}
      <div className="flex-1 overflow-hidden rounded-md border border-white/10 bg-[#0d1117] p-4 text-white sm:p-6 lg:rounded-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-normal">Contributions in {activeYear}</h3>
          <div className="text-xs text-white/50 hidden sm:block cursor-pointer hover:text-white transition-colors">
            Contribution settings <span className="ml-1 text-[10px]">▼</span>
          </div>
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[700px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {mounted && (
                  <GitHubCalendar 
                    username="786RY9"
                    year={activeYear === new Date().getFullYear() ? "last" : activeYear}
                    colorScheme="dark"
                    theme={customTheme}
                    blockMargin={4}
                    blockRadius={2}
                    blockSize={11}
                    fontSize={12}
                    hideTotalCount
                    hideColorLegend
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-white/50">
          <a href="#" className="hover:text-[#58a6ff] transition-colors">
            Learn how we count contributions
          </a>
          <div className="flex items-center gap-1">
            <span>Less</span>
            {customTheme.dark.map((color, i) => (
              <span 
                key={i} 
                className="h-2.5 w-2.5 rounded-sm" 
                style={{ backgroundColor: color }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Year Selector */}
      <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:w-32 shrink-0">
        {YEARS.map(year => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={`rounded-md px-4 py-2 text-sm text-left transition-colors whitespace-nowrap ${
              activeYear === year
                ? "bg-[#1f6feb] text-white font-semibold"
                : "text-white/70 hover:bg-white/10"
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  )
}
