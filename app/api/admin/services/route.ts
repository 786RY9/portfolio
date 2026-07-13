import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/auth"
import { fetchServices, updateServices } from "@/lib/cms-github"
import type { Service } from "@/lib/cms-types"

/** GET /api/admin/services — get services for editing */
export async function GET() {
  const check = await requireAdminSession()
  if (!check.ok) return check.response

  try {
    const services = await fetchServices()
    return NextResponse.json(services)
  } catch (err) {
    console.error("[admin/services GET] Error:", err)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

/** PUT /api/admin/services — update the full services list */
export async function PUT(req: NextRequest) {
  const check = await requireAdminSession()
  if (!check.ok) return check.response

  let services: Service[]
  try {
    services = await req.json()
    if (!Array.isArray(services)) throw new Error("Expected array")
  } catch {
    return NextResponse.json({ error: "Invalid JSON body — expected array of services" }, { status: 400 })
  }

  // Basic validation of each service
  for (const s of services) {
    if (!s.id || !s.title || !s.description) {
      return NextResponse.json({ error: "Each service must have id, title, description" }, { status: 400 })
    }
  }

  try {
    await updateServices(services)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[admin/services PUT] Error:", err)
    return NextResponse.json({ error: "Failed to update services" }, { status: 500 })
  }
}
