import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { IntroOverlay } from "@/components/intro-overlay"
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

export const metadata: Metadata = {
  title: "Rashid Yaseen — Developer Portfolio",
  description:
    "Developing seamless web and Flutter applications, powered by scalable machine learning and automated deployment pipelines.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} bg-background`}
    >
      <body className="font-sans antialiased bg-black text-white md:cursor-none">
        <SmoothScrollProvider>
          <IntroOverlay />
          <CustomCursor />
          <ScrollProgress />
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
