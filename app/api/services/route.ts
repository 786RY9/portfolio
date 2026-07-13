import { NextResponse } from "next/server"
import { fetchServices } from "@/lib/cms-github"

export const revalidate = 300

export async function GET() {
  try {
    const services = await fetchServices()
    return NextResponse.json(services, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
    })
  } catch (err) {
    console.error("[api/services] Error:", err)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
