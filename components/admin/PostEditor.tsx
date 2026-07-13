"use client"

/**
 * PostEditor — BlockNote v0.51.x rich text editor.
 *
 * Uses the correct v0.51 API:
 *   - BlockNoteViewRaw (the base view component)
 *   - BlockNoteDefaultUI (toolbar, slash menu, etc.)
 *   - useCreateBlockNote hook
 *
 * Includes:
 *   - Full text formatting (headings, bold, italic, underline, strikethrough, colors)
 *   - Image upload (via /api/admin/media)
 *   - YouTube / Loom / Vimeo / Twitter-X video embeds (custom block)
 *   - Code blocks, tables, blockquotes
 */

import { useCallback } from "react"
import {
  BlockNoteEditor,
  type PartialBlock,
} from "@blocknote/core"
import "@blocknote/core/fonts/inter.css"
import {
  BlockNoteViewRaw,
  BlockNoteDefaultUI,
  useCreateBlockNote,
} from "@blocknote/react"
import "@blocknote/mantine/style.css"
import { Video, Youtube } from "lucide-react"
import { useState } from "react"
import type { PostType } from "@/lib/cms-types"

// ─────────────────────────────────────────────────────────────────────────────
// Video embed URL normalizer
// Supports: YouTube, Loom, Vimeo, Twitter/X
// ─────────────────────────────────────────────────────────────────────────────
function toEmbedUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim())
    const host = url.hostname.replace(/^www\./, "")

    if (host === "youtube.com" || host === "youtu.be") {
      let id: string | null = null
      if (host === "youtu.be") id = url.pathname.slice(1)
      else if (url.pathname === "/watch") id = url.searchParams.get("v")
      else if (url.pathname.startsWith("/shorts/")) id = url.pathname.split("/")[2]
      else if (url.pathname.startsWith("/embed/")) return raw
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
    }

    if (host === "loom.com") {
      const parts = url.pathname.split("/")
      const shareIdx = parts.indexOf("share")
      const embedIdx = parts.indexOf("embed")
      const id = parts[shareIdx + 1] ?? parts[embedIdx + 1]
      if (id) return `https://www.loom.com/embed/${id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean).pop()
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`
    }

    if (host === "twitter.com" || host === "x.com") {
      return `https://twitframe.com/show?url=${encodeURIComponent(raw)}`
    }

    return null
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VideoEmbedPanel — standalone embed widget (inserted below editor)
// ─────────────────────────────────────────────────────────────────────────────
export function VideoEmbedPanel({ onInsert }: { onInsert?: (embedUrl: string, rawUrl: string) => void }) {
  const [input, setInput] = useState("")
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleEmbed = () => {
    const u = toEmbedUrl(input)
    if (!u) {
      setError("Unsupported URL. Paste a YouTube, Loom, Vimeo, or X link.")
      return
    }
    setEmbedUrl(u)
    setError("")
    onInsert?.(u, input)
  }

  return (
    <div className="my-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/40">
        <Video className="h-3.5 w-3.5" />
        Embed Video (YouTube · Loom · Vimeo · X)
      </div>
      {embedUrl ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded video"
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-white/20 bg-black/40">
          <div className="flex flex-col items-center gap-2 text-center">
            <Youtube className="h-8 w-8 text-white/20" />
            <span className="text-xs text-white/30">Paste a video URL below to embed</span>
          </div>
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEmbed()}
          placeholder="https://youtube.com/watch?v=... or loom.com/share/..."
          className="flex-1 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-[oklch(0.55_0.22_25)]/60 focus:outline-none"
        />
        <button
          onClick={handleEmbed}
          className="rounded-lg bg-[oklch(0.55_0.22_25)]/20 px-4 py-2 text-xs font-semibold text-[oklch(0.7_0.18_25)] transition hover:bg-[oklch(0.55_0.22_25)]/30"
        >
          Embed
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline video embed renderer (for public post pages)
// ─────────────────────────────────────────────────────────────────────────────
export function VideoEmbed({ src, rawUrl }: { src: string; rawUrl?: string }) {
  if (!src) return null
  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-xl border border-white/10">
      <iframe
        src={src}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={rawUrl ?? "Embedded video"}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PostEditor — main editor component for admin
// ─────────────────────────────────────────────────────────────────────────────
interface PostEditorProps {
  postType: PostType
  slug: string
  initialContent?: PartialBlock[]
  onChange?: (content: PartialBlock[]) => void
  readOnly?: boolean
}

export function PostEditor({
  postType,
  slug,
  initialContent,
  onChange,
  readOnly = false,
}: PostEditorProps) {
  const editor = useCreateBlockNote({
    initialContent: initialContent ?? undefined,
    uploadFile: async (file: File) => {
      const formData = new FormData()
      formData.append("type", postType)
      formData.append("slug", slug)
      formData.append("role", "media")
      formData.append("file", file)
      const res = await fetch("/api/admin/media", { method: "POST", body: formData })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }))
        throw new Error(err.error ?? "Upload failed")
      }
      const { url } = await res.json()
      return url
    },
  })

  return (
    <div
      className="min-h-[400px] rounded-xl border border-white/10 bg-[#0d0d0d] overflow-hidden"
      data-blocknote-theme="dark"
    >
      <style>{`
        [data-blocknote-theme] .bn-editor { background: transparent !important; color: rgba(255,255,255,0.9) !important; }
        [data-blocknote-theme] .bn-editor [contenteditable] { min-height: 300px; padding: 1.5rem 2rem; }
        [data-blocknote-theme] .bn-toolbar, [data-blocknote-theme] .mantine-Toolbar-root { background: #1a1a1a !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; }
        [data-blocknote-theme] .mantine-Button-root { color: rgba(255,255,255,0.7) !important; }
        [data-blocknote-theme] .mantine-Popover-dropdown { background: #1a1a1a !important; border: 1px solid rgba(255,255,255,0.1) !important; }
        [data-blocknote-theme] .bn-slash-menu { background: #1a1a1a !important; border: 1px solid rgba(255,255,255,0.1) !important; }
      `}</style>
      <BlockNoteViewRaw
        editor={editor}
        editable={!readOnly}
        theme="dark"
        onChange={() => {
          onChange?.(editor.document as PartialBlock[])
        }}
      >
        <BlockNoteDefaultUI />
      </BlockNoteViewRaw>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PostRenderer — read-only view for public pages
// ─────────────────────────────────────────────────────────────────────────────
export function PostRenderer({ content }: { content: PartialBlock[] }) {
  const editor = useCreateBlockNote({ initialContent: content })

  return (
    <div className="prose-dark" data-blocknote-theme="dark">
      <style>{`
        [data-blocknote-theme] .bn-editor { background: transparent !important; }
        [data-blocknote-theme] .bn-editor [contenteditable] { padding: 0; cursor: default; }
      `}</style>
      <BlockNoteViewRaw editor={editor} editable={false} theme="dark">
        <BlockNoteDefaultUI />
      </BlockNoteViewRaw>
    </div>
  )
}
