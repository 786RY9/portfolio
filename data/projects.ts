/**
 * Project content for the homepage "Projects" section (components/selected-projects.tsx).
 * Source of truth: Rashid_Yaseen_Resume_ML_Engineer.pdf. Keep the two in sync.
 *
 * Edit this file to add, remove or reorder projects. Order here = order on the page.
 *
 * Screenshots: drop an image into `public/projects/` and set `image` on the project, e.g.
 *   image: { src: "/projects/wheat-disease.png", alt: "Classifier output on a wheat leaf photo" },
 * Until `image` is set, the card shows a styled placeholder in the same slot.
 */

export type ProjectLink = {
  label: string
  href: string
}

export type Project = {
  /** Stable key, also used as the article's id (e.g. /#project-marto). */
  id: string
  title: string
  /** Short context line shown above the title: where/why it was built. Optional. */
  context?: string
  /** Shown at the right of the context line. Optional. */
  year?: string
  /** One-line hook. */
  hook: string
  /** 1–3 short lines on what was built. */
  body: string[]
  tags: string[]
  links?: ProjectLink[]
  /** Small badge, e.g. visibility notes. */
  badge?: string
  /** IMAGE SLOT: leave undefined to show the placeholder. Files live in public/projects/. */
  image?: { src: string; alt: string }
}

export type Website = {
  id: string
  name: string
  /** What the site is, in a few words. */
  kind: string
  href: string
}

export const projects: Project[] = [
  {
    id: "wheat-disease",
    title: "Wheat Disease Classification",
    context: "Computer vision · NUST",
    hook: "Detecting disease in wheat crops from photographs.",
    body: [
      "Trained a deep learning image classification model in TensorFlow.",
      "Worked with a small dataset where some disease classes had far fewer images than others, which shaped how the model was trained and how its results were judged.",
    ],
    tags: ["Python", "TensorFlow", "Computer Vision"],
    // image: { src: "/projects/wheat-disease.png", alt: "" },
  },
  {
    id: "malware-detection",
    title: "AI-Based Malware Detection & Prevention System",
    context: "Final year project · Graded A",
    year: "2025–2026",
    hook: "Static ML classification plus dynamic sandbox analysis in one desktop app.",
    body: [
      "40,000+ malware and clean files joined with EMBER to train ML and deep learning static classifiers, tuned for the precision/recall trade-off.",
      "Each sample runs in a hardened, isolated Windows 10 VM under CAPEv2, which records memory dumps and network activity and returns a behavioral verdict.",
      "Flutter desktop app with a Supabase SHA-256 cache, so files already analyzed skip inference.",
    ],
    tags: ["Python", "ML/DL", "EMBER", "CAPEv2", "Flutter", "Supabase"],
    badge: "Private: under MoU with another university",
    // image: { src: "/projects/malware-detection.png", alt: "" },
  },
  {
    id: "marto",
    title: "Marto: Grocery Delivery Platform",
    context: "Client project",
    year: "2026",
    hook: "The complete digital system for a grocery store.",
    body: [
      "Customer website, customer and rider Android apps, an ops portal for packing and dispatch, and an admin dashboard for products, promotions and reports.",
      "TypeScript monorepo with a typed Fastify API, PostgreSQL + Prisma migrations, English and Urdu (RTL) interfaces, and background jobs for delivery slots and backups.",
      "Deployed on Oracle Cloud with HTTPS through Caddy, tested with Vitest and Playwright.",
    ],
    tags: ["TypeScript", "Fastify", "Next.js", "React Native", "PostgreSQL", "Prisma"],
    // image: { src: "/projects/marto.png", alt: "" },
  },
  {
    id: "rag-meal-planner",
    title: "AI Meal Planner & Fitness Coach (RAG)",
    year: "2026",
    hook: "A nutrition assistant that shows its sources.",
    body: [
      "Retrieves from an Amazon Bedrock Knowledge Base over documents in S3 and generates with Google Gemini or Amazon Nova.",
      "Accounts for each user's allergies, preferences and goals, drops low-confidence matches, and shows the sources behind every reply.",
    ],
    tags: ["Python", "FastAPI", "Next.js", "Amazon Bedrock", "Gemini", "Docker"],
    links: [
      {
        label: "Source on GitHub",
        href: "https://github.com/786RY9/RAG-AI-Meal-Planner-Health-Coach-AWS-Bedrock",
      },
    ],
    // image: { src: "/projects/rag-meal-planner.png", alt: "" },
  },
  // To remove the Dastaq card, delete this whole object.
  {
    id: "dastaq",
    title: "Dastaq: Courier Service Platform",
    context: "At Sofrix",
    year: "2026–present",
    hook: "Managing the full system behind a courier company.",
    body: ["Feature work, fixes, maintenance and ongoing improvements across the whole product."],
    tags: ["Full-stack", "PostgreSQL", "Prisma"],
    // image: { src: "/projects/dastaq.png", alt: "" },
  },
]

export const websites: Website[] = [
  {
    id: "dayframe",
    name: "Dayframe Studio",
    kind: "Creative website",
    href: "https://dayframestudio.vercel.app",
  },
  {
    id: "ark-trackers",
    name: "Ark Trackers",
    kind: "3D interactive site",
    href: "https://arktrackers.com",
  },
  {
    id: "innergy-care",
    name: "Innergy Care",
    kind: "UK therapy practice",
    href: "https://innergycare.com",
  },
]
