/**
 * Content for the homepage "Experience" section (components/experience.tsx).
 * Source of truth: Rashid_Yaseen_Resume_ML_Engineer.pdf. Keep the two in sync.
 * Order here = order on the page (most recent first).
 */

export type Role = {
  id: string
  title: string
  company: string
  /** Shown as written, e.g. "2026 – Present". */
  dates: string
  points: string[]
}

export type Education = {
  degree: string
  school: string
  dates: string
  points: string[]
}

export const roles: Role[] = [
  {
    id: "sofrix",
    title: "Full-Stack Engineer",
    company: "Sofrix",
    dates: "2026 – Present",
    points: [
      "Manage the complete system for Dastaq, a courier service company: new features, fixes, maintenance and ongoing improvements.",
      "Build AI systems for client businesses, taking each one from requirements to a working deployment.",
      "Develop ERP systems for companies in the textile industry.",
      "Work with PostgreSQL and Prisma every day: schema design, migrations and query work across client products.",
    ],
  },
  {
    id: "tecveq",
    title: "AI/ML Engineer",
    company: "Tecveq",
    dates: "2026",
    points: [
      "Researched and built multi-agent LLM systems for healthcare and supply-chain use cases, comparing ways for agents to coordinate and turning the strongest designs into working prototypes.",
    ],
  },
  {
    id: "absolute-solutions",
    title: "Malware Remediation Technician (Contract)",
    company: "Absolute Solutions",
    dates: "May 2026",
    points: [
      "Cleaned live malware infections from client Windows machines across several environments at once, using AI-assisted triage to identify threats faster.",
    ],
  },
  {
    id: "techcognify",
    title: "Web Developer (Contract)",
    company: "Techcognify",
    dates: "Nov 2025 – Jan 2026",
    points: [
      "Built and launched a 3D interactive website for Ark Trackers and a site for Innergy Care, a UK therapy practice, with content the client edits through a headless CMS.",
    ],
  },
  {
    id: "ncai",
    title: "Machine Learning & DevOps Intern",
    company: "National Center of Artificial Intelligence (NCAI), NUST",
    dates: "Jan 2025 – Apr 2025",
    points: [
      "Deployed a Python machine learning backend on the center's own servers and set up secure remote access so end users could reach it.",
      "Containerized applications with Docker and automated build and deployment with GitHub Actions CI/CD pipelines.",
      "Ran Linux administration for the team: users, services, permissions, SSH access and troubleshooting.",
    ],
  },
]

export const education: Education = {
  degree: "BS Computer Science",
  school: "National University of Sciences and Technology (NUST)",
  dates: "2022 – 2026",
  points: [
    "Final year project graded A.",
    "Coursework: Machine Learning, Information Security, Operating Systems, Computer Networks, Database Systems.",
    "Certification: AWS Cloud Technical Essentials (Amazon Web Services).",
  ],
}
