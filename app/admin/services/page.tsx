"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Save, GripVertical, Check, AlertCircle } from "lucide-react"
import type { Service } from "@/lib/cms-types"

const ICON_OPTIONS = [
  "Globe", "Smartphone", "Brain", "Bot", "Server", "Shield",
  "Terminal", "Code2", "Layers", "Cpu", "Wrench", "Rocket",
]

type Status = { type: "idle" | "saving" | "success" | "error"; message?: string }

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<Status>({ type: "idle" })

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => { setServices(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const update = (idx: number, field: keyof Service, value: unknown) => {
    setServices((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  const updateFeature = (sIdx: number, fIdx: number, val: string) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? { ...s, features: s.features.map((f, fi) => fi === fIdx ? val : f) }
          : s
      )
    )
  }

  const addService = () => {
    const id = `service-${Date.now()}`
    setServices((prev) => [
      ...prev,
      {
        id,
        title: "New Service",
        tagline: "Short tagline",
        description: "Describe what you offer…",
        icon: "Globe",
        features: ["Feature 1", "Feature 2"],
        featured: false,
        order: prev.length,
      },
    ])
  }

  const removeService = (idx: number) => {
    setServices((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    setStatus({ type: "saving" })
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed")
      setStatus({ type: "success" })
      setTimeout(() => setStatus({ type: "idle" }), 2000)
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Save failed" })
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-white/30">
        Loading services…
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">// Settings</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Services</h1>
          <p className="mt-1 text-sm text-white/40">Edit the services shown on your portfolio.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addService}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <Plus className="h-4 w-4" /> Add Service
          </button>
          <button
            onClick={handleSave}
            disabled={status.type === "saving"}
            className="flex items-center gap-2 rounded-xl bg-[oklch(0.55_0.22_25)]/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[oklch(0.55_0.22_25)] disabled:opacity-60"
          >
            {status.type === "saving" ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Saving…</>
            ) : status.type === "success" ? (
              <><Check className="h-4 w-4" /> Saved!</>
            ) : (
              <><Save className="h-4 w-4" /> Save All</>
            )}
          </button>
        </div>
      </div>

      {status.type === "error" && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          {status.message}
        </div>
      )}

      <div className="space-y-4">
        {services.map((svc, idx) => (
          <div
            key={svc.id}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-white/20" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                Service {idx + 1}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-white/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={svc.featured}
                    onChange={(e) => update(idx, "featured", e.target.checked)}
                    className="accent-[oklch(0.65_0.22_25)]"
                  />
                  Featured
                </label>
                <button
                  onClick={() => removeService(idx)}
                  className="rounded-lg p-1.5 text-white/20 transition hover:bg-red-950/30 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label-xs">Title</label>
                <input
                  type="text"
                  value={svc.title}
                  onChange={(e) => update(idx, "title", e.target.value)}
                  className="cms-input"
                />
              </div>
              <div>
                <label className="label-xs">Icon (Lucide name)</label>
                <select
                  value={svc.icon}
                  onChange={(e) => update(idx, "icon", e.target.value)}
                  className="cms-input"
                >
                  {ICON_OPTIONS.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label-xs">Tagline</label>
                <input
                  type="text"
                  value={svc.tagline}
                  onChange={(e) => update(idx, "tagline", e.target.value)}
                  className="cms-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label-xs">Description</label>
                <textarea
                  value={svc.description}
                  onChange={(e) => update(idx, "description", e.target.value)}
                  rows={3}
                  className="cms-input resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label-xs">Features (one per line)</label>
                <div className="space-y-1.5">
                  {svc.features.map((f, fi) => (
                    <div key={fi} className="flex gap-2">
                      <input
                        type="text"
                        value={f}
                        onChange={(e) => updateFeature(idx, fi, e.target.value)}
                        className="cms-input flex-1"
                      />
                      <button
                        onClick={() =>
                          update(idx, "features", svc.features.filter((_, i) => i !== fi))
                        }
                        className="rounded-lg px-2 text-white/20 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => update(idx, "features", [...svc.features, ""])}
                    className="text-xs text-white/30 hover:text-white/60"
                  >
                    + Add feature
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .label-xs { display: block; margin-bottom: 0.375rem; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.3); }
        .cms-input { width: 100%; border-radius: 0.625rem; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); padding: 0.5rem 0.875rem; font-size: 0.875rem; color: rgba(255,255,255,0.85); transition: border-color 0.15s; }
        .cms-input:focus { outline: none; border-color: oklch(0.55 0.22 25 / 0.5); }
        .cms-input option { background: #111; }
      `}</style>
    </div>
  )
}
