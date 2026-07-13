import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession, validateSlug } from "@/lib/auth"
import { uploadMedia, uploadCover } from "@/lib/cms-github"
import type { PostType } from "@/lib/cms-types"

// Allowed MIME types and their max sizes in bytes
const ALLOWED_TYPES: Record<string, number> = {
  "image/jpeg": 10 * 1024 * 1024,   // 10 MB
  "image/jpg": 10 * 1024 * 1024,
  "image/png": 10 * 1024 * 1024,
  "image/gif": 25 * 1024 * 1024,    // 25 MB (GIFs can be larger)
  "image/webp": 10 * 1024 * 1024,
  "video/mp4": 50 * 1024 * 1024,    // 50 MB
}

const ALLOWED_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "gif", "webp", "mp4",
])

/**
 * POST /api/admin/media
 *
 * Multipart form with fields:
 *   - type: "blog" | "learnings"
 *   - slug: post slug
 *   - role: "cover" | "media"
 *   - file: the binary file
 */
export async function POST(req: NextRequest) {
  const check = await requireAdminSession()
  if (!check.ok) return check.response

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  const type = formData.get("type") as string
  const slug = formData.get("slug") as string
  const role = (formData.get("role") as string) ?? "media"
  const file = formData.get("file") as File | null

  // Validate type
  if (type !== "blog" && type !== "learnings") {
    return NextResponse.json({ error: "Invalid post type" }, { status: 400 })
  }

  // Validate slug
  const safe = validateSlug(slug)
  if (!safe) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
  }

  // Validate file presence
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  // Validate MIME type
  const mime = file.type.toLowerCase()
  const maxSize = ALLOWED_TYPES[mime]
  if (!maxSize) {
    return NextResponse.json(
      { error: `File type '${mime}' is not allowed. Allowed: ${Object.keys(ALLOWED_TYPES).join(", ")}` },
      { status: 415 }
    )
  }

  // Validate extension matches MIME
  const nameParts = file.name.split(".")
  const ext = (nameParts[nameParts.length - 1] ?? "").toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json({ error: `Extension '${ext}' not allowed` }, { status: 415 })
  }

  // Validate file size
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File too large. Max ${Math.round(maxSize / 1024 / 1024)} MB for ${mime}` },
      { status: 413 }
    )
  }

  // Convert to base64
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString("base64")

  try {
    let url: string
    if (role === "cover") {
      url = await uploadCover(type as PostType, safe, base64, ext)
    } else {
      url = await uploadMedia(type as PostType, safe, file.name, base64)
    }
    return NextResponse.json({ url }, { status: 201 })
  } catch (err) {
    console.error("[admin/media POST] Error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
