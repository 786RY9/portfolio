"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import type { PostType } from "@/lib/cms-types"

export default function AdminPostActions({
  slug,
  type,
  draft,
}: {
  slug: string
  type: PostType
  draft: boolean
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const handleDelete = async () => {
    if (!confirm) { setConfirm(true); return }
    setDeleting(true)
    try {
      await fetch(`/api/admin/posts/${type}/${slug}`, { method: "DELETE" })
      router.refresh()
    } finally {
      setDeleting(false)
      setConfirm(false)
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-2 ml-4">
      {!draft && (
        <Link
          href={`/${type}/${slug}`}
          target="_blank"
          className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white/60"
          title="View live"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      )}
      <Link
        href={`/admin/${type}/${slug}`}
        className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white/60"
        title="Edit"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        title={confirm ? "Click again to confirm delete" : "Delete"}
        className={[
          "rounded-lg p-2 transition",
          confirm
            ? "bg-red-950/40 text-red-400 hover:bg-red-950/60"
            : "text-white/20 hover:bg-white/[0.05] hover:text-red-400",
        ].join(" ")}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
