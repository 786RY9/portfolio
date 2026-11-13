import { roles, education } from "@/data/experience"

/**
 * Homepage "Experience" section. Server component: fully present in the
 * server-rendered HTML. Content lives in data/experience.ts.
 */

const ACCENT = "oklch(0.55 0.22 25)"
const ACCENT_GLOW = "oklch(0.7 0.18 25)"

type EntryProps = {
  dates: string
  title: string
  org: string
  points: string[]
  /** Top hairline between entries. Off when a heading rule already sits above. */
  divider?: boolean
}

function Entry({ dates, title, org, points, divider = true }: EntryProps) {
  return (
    <li className={`grid gap-3 py-9 md:grid-cols-12 md:gap-8 ${divider ? "border-t border-white/10" : ""}`}>
      <p
        className="font-mono text-[11px] uppercase tracking-[0.25em] md:col-span-3 md:pt-2"
        style={{ color: ACCENT_GLOW }}
      >
        {dates}
      </p>
      <div className="md:col-span-9">
        <h3 className="font-serif text-2xl italic leading-tight text-white sm:text-3xl">{title}</h3>
        <p className="mt-1 text-sm text-white/60">{org}</p>
        <ul className="mt-4 max-w-3xl space-y-2">
          {points.map((point) => (
            <li key={point} className="flex gap-3 text-sm leading-relaxed text-white/55">
              <span
                aria-hidden
                className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: ACCENT_GLOW }}
              />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative w-full scroll-mt-8 bg-black py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section heading (same pattern as Skills / Services / Projects) */}
        <div className="mb-14 flex flex-col items-center text-center sm:mb-20">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
            <span className="h-px w-8" style={{ backgroundColor: ACCENT }} />
            <span>// Experience</span>
            <span className="h-px w-8" style={{ backgroundColor: ACCENT }} />
          </div>
          <h2
            id="experience-heading"
            className="mt-6 font-serif text-5xl font-black italic tracking-tight text-white sm:text-7xl"
          >
            Where I&apos;ve worked
          </h2>
        </div>

        <ol className="border-b border-white/10">
          {roles.map((role) => (
            <Entry
              key={role.id}
              dates={role.dates}
              title={role.title}
              org={role.company}
              points={role.points}
            />
          ))}
        </ol>

        <div className="mt-16 sm:mt-20">
          <div className="mb-2 flex items-center gap-5">
            <h3 className="font-serif text-2xl italic text-white sm:text-3xl">Education</h3>
            <span aria-hidden className="h-px flex-1 bg-white/10" />
          </div>
          <ul>
            <Entry
              dates={education.dates}
              title={education.degree}
              org={education.school}
              points={education.points}
              divider={false}
            />
          </ul>
        </div>
      </div>
    </section>
  )
}
