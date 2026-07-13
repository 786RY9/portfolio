"use client"

/**
 * Client Component wrapper that lazy-loads PostRenderer with ssr:false.
 *
 * Why: next/dynamic with ssr:false is only allowed inside Client Components.
 * The public blog/learnings pages are Server Components, so they import THIS
 * wrapper instead of using dynamic() themselves.
 *
 * BlockNote uses browser-only APIs (window, document) so it must never
 * execute during Next.js SSR or static build pre-rendering.
 */

import dynamic from "next/dynamic"
import type { PartialBlock } from "@blocknote/core"

const PostRenderer = dynamic(
  () => import("@/components/admin/PostEditor").then((m) => ({ default: m.PostRenderer })),
  {
    ssr: false,
    loading: () => (
      <div className="py-12 text-center">
        <span className="font-mono text-xs text-white/20 animate-pulse">Loading content…</span>
      </div>
    ),
  }
)

export function PostRendererWrapper({ content }: { content: PartialBlock[] }) {
  return <PostRenderer content={content} />
}
