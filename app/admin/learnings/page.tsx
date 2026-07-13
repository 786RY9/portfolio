import Link from "next/link"
import { listPosts } from "@/lib/cms-github"
import { PenSquare, Eye, EyeOff, BookOpen } from "lucide-react"
import AdminPostActions from "../blog/AdminPostActions"

export default async function AdminLearningsPage() {
  const posts = await listPosts("learnings", true)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">// Content</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Learning Entries</h1>
        </div>
        <Link
          href="/admin/learnings/new"
          className="flex items-center gap-2 rounded-xl bg-[oklch(0.55_0.22_25)]/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[oklch(0.55_0.22_25)]"
        >
          <PenSquare className="h-4 w-4" />
          New Entry
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-white/15" />
          <p className="text-sm text-white/30">No entries yet.</p>
          <Link href="/admin/learnings/new" className="mt-4 inline-flex items-center gap-2 text-sm text-[oklch(0.7_0.18_25)] hover:underline">
            Log your first learning →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition hover:border-white/15 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={[
                  "shrink-0 rounded-full p-1.5",
                  post.draft ? "bg-yellow-950/40 text-yellow-500" : "bg-emerald-950/40 text-emerald-400",
                ].join(" ")}>
                  {post.draft ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{post.title}</p>
                  <p className="mt-0.5 truncate text-xs text-white/30">
                    /learnings/{post.slug} · {new Date(post.publishedAt).toLocaleDateString()}
                    {post.tags.length > 0 && ` · ${post.tags.slice(0, 3).join(", ")}`}
                  </p>
                </div>
              </div>
              <AdminPostActions slug={post.slug} type="learnings" draft={post.draft} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
