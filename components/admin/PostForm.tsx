"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Save, Eye, EyeOff, Upload, X, Tag, AlertCircle, Check } from "lucide-react"
import type { PostType, Post } from "@/lib/cms-types"
import type { PartialBlock } from "@blocknote/core"
import slugify from "slugify"

// Dynamic imports with ssr:false prevent BlockNote (which uses window/document)
// from running during server-side rendering / static build pre-rendering
const PostEditor = dynamic(
  () => import("./PostEditor").then((m) => ({ default: m.PostEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] rounded-xl border border-white/10 bg-[#0d0d0d] flex items-center justify-center">
        <span className="font-mono text-xs text-white/20 animate-pulse">Loading editor…</span>
      </div>
    ),
  }
)

const VideoEmbedPanel = dynamic(
  () => import("./PostEditor").then((m) => ({ default: m.VideoEmbedPanel })),
  { ssr: false }
)

interface PostFormProps {
  postType: PostType
  existingPost?: Post
}

type Status = { type: "idle" | "saving" | "success" | "error"; message?: string }

export function PostForm({ postType, existingPost }: PostFormProps) {
  const router = useRouter()
  const isEdit = !!existingPost

  const [title, setTitle] = useState(existingPost?.title ?? "")
  const [slug, setSlug] = useState(existingPost?.slug ?? "")
  const [slugManual, setSlugManual] = useState(isEdit)
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt ?? "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(existingPost?.tags ?? [])
  const [draft, setDraft] = useState(existingPost?.draft ?? true)
  const [content, setContent] = useState<PartialBlock[]>(
    (existingPost?.content as PartialBlock[]) ?? []
  )
  const [coverPreview, setCoverPreview] = useState<string | null>(existingPost?.coverUrl ?? null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>({ type: "idle" })

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slugManual) {
      setSlug(slugify(val, { lower: true, strict: true, trim: true }))
    }
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput("")
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setStatus({ type: "error", message: "Title is required" })
      return
    }
    const finalSlug = slug || slugify(title, { lower: true, strict: true })
    if (!finalSlug) {
      setStatus({ type: "error", message: "Slug is required" })
      return
    }

    setStatus({ type: "saving" })

    try {
      // 1. Upload cover if a new file was selected
      if (coverFile) {
        const coverForm = new FormData()
        coverForm.append("type", postType)
        coverForm.append("slug", finalSlug)
        coverForm.append("role", "cover")
        coverForm.append("file", coverFile)
        const coverRes = await fetch("/api/admin/media", { method: "POST", body: coverForm })
        if (!coverRes.ok) {
          const err = await coverRes.json()
          throw new Error(err.error ?? "Cover upload failed")
        }
      }

      // 2. Save post metadata + content
      const method = isEdit ? "PUT" : "POST"
      const url = isEdit
        ? `/api/admin/posts/${postType}/${finalSlug}`
        : `/api/admin/posts`
      const body = {
        type: postType,
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        tags,
        draft,
        content,
      }
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Save failed")
      }

      setStatus({ type: "success", message: "Saved successfully" })
      setTimeout(() => {
        router.push(`/admin/${postType}`)
        router.refresh()
      }, 800)
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Save failed",
      })
    }
  }, [title, slug, excerpt, tags, draft, content, coverFile, postType, isEdit, router])

  const typeLabel = postType === "blog" ? "Blog Post" : "Learning Entry"

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
            {isEdit ? `Edit ${typeLabel}` : `New ${typeLabel}`}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            {isEdit ? existingPost.title : `Create ${typeLabel}`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Draft toggle */}
          <button
            onClick={() => setDraft((d) => !d)}
            className={[
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
              draft
                ? "border-yellow-800/50 bg-yellow-950/30 text-yellow-500/80"
                : "border-emerald-800/50 bg-emerald-950/30 text-emerald-400",
            ].join(" ")}
          >
            {draft ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {draft ? "Draft" : "Published"}
          </button>
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={status.type === "saving"}
            className="flex items-center gap-2 rounded-xl bg-[oklch(0.55_0.22_25)]/80 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[oklch(0.55_0.22_25)] disabled:opacity-60"
          >
            {status.type === "saving" ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving…
              </>
            ) : status.type === "success" ? (
              <>
                <Check className="h-4 w-4" /> Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {status.type === "error" && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {status.message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main content */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-white/40">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={postType === "blog" ? "HTB: Machines — How I Pwned XYZ" : "Learned Functional Programming"}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-lg font-bold text-white placeholder:text-white/20 focus:border-[oklch(0.55_0.22_25)]/50 focus:outline-none focus:ring-1 focus:ring-[oklch(0.55_0.22_25)]/30 transition"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-white/40">
              Slug (URL)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                  setSlugManual(true)
                }}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-sm text-white/70 focus:border-[oklch(0.55_0.22_25)]/50 focus:outline-none transition"
              />
              {slugManual && (
                <button
                  onClick={() => {
                    setSlugManual(false)
                    setSlug(slugify(title, { lower: true, strict: true }))
                  }}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/40 hover:text-white/70"
                >
                  Auto
                </button>
              )}
            </div>
            <p className="mt-1 text-[10px] text-white/25">
              /{postType}/{slug || "your-slug-here"}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-white/40">
              Excerpt (shown on listing page)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Brief summary of this post…"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:border-[oklch(0.55_0.22_25)]/50 focus:outline-none transition"
            />
          </div>

          {/* BlockNote Editor */}
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-white/40">
              Content
            </label>
            <PostEditor
              postType={postType}
              slug={slug || "draft"}
              initialContent={content.length > 0 ? content : undefined}
              onChange={setContent}
            />
            <p className="mt-2 text-[10px] text-white/25">
              Tip: Type / for commands · Drag or paste images to upload them automatically
            </p>
          </div>

          {/* Video Embed */}
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-white/40">
              Embed Video
            </label>
            <VideoEmbedPanel />
            <p className="mt-1 text-[10px] text-white/20">
              Embeds are rendered inline on the published post. Copy the iframe src into your content manually or use the embed block above to preview.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Cover image */}
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-white/40">
              Cover Image
            </label>
            <div className="relative">
              {coverPreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreview}
                    alt="Cover"
                    className="w-full rounded-xl border border-white/10 object-cover"
                    style={{ aspectRatio: "16/9" }}
                  />
                  <button
                    onClick={() => { setCoverPreview(null); setCoverFile(null) }}
                    className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white/60 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] transition hover:border-white/25 hover:bg-white/[0.04]">
                  <Upload className="h-6 w-6 text-white/25" />
                  <span className="text-xs text-white/30">Upload cover image</span>
                  <span className="text-[10px] text-white/20">JPEG, PNG, WebP · max 10 MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-white/40">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tag…"
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:outline-none"
              />
              <button
                onClick={addTag}
                className="rounded-lg border border-white/10 px-3 py-2 text-white/50 hover:text-white"
              >
                <Tag className="h-4 w-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-white/60"
                  >
                    {t}
                    <button
                      onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                      className="text-white/30 hover:text-white/70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-white/30 space-y-1.5">
            <p><span className="text-white/50">Status:</span> {draft ? "Draft (not public)" : "Published"}</p>
            {existingPost && (
              <>
                <p><span className="text-white/50">Created:</span> {new Date(existingPost.publishedAt).toLocaleDateString()}</p>
                <p><span className="text-white/50">Updated:</span> {new Date(existingPost.updatedAt).toLocaleDateString()}</p>
              </>
            )}
            <p className="pt-2 text-[10px] text-white/20 leading-relaxed">
              Content is saved to the GitHub repo as JSON. All media is committed and served via the proxied asset API.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
