import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import { Loader } from "@/components/loader"
import { INTRO_SCRIPT } from "@/lib/intro"
import "./globals.css"

import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider"
import { CustomCursor } from "@/components/ui/custom-cursor"
import { ScrollProgress } from "@/components/ui/scroll-progress"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
})

const SITE_URL = "https://www.ryaseen.studio"
const TITLE = "Rashid Yaseen | Machine Learning & Full-Stack AI Engineer"
const DESCRIPTION =
  "Machine learning and full-stack AI engineer. Computer vision, ML malware detection, RAG assistants on AWS Bedrock, and production web and mobile platforms. Open to ML and full-stack roles."

// Social preview image: app/opengraph-image.png and app/twitter-image.png (file convention).
// Favicon: app/favicon.ico, app/icon.png, app/apple-icon.png (file convention).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Rashid Yaseen", url: SITE_URL }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Rashid Yaseen",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@ras_yaseen5484",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: INTRO_SCRIPT may add data-intro to <html> before hydration.
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="font-sans antialiased bg-black text-white md:cursor-none">
        <SmoothScrollProvider>
          <Loader />
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
