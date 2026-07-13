import { notFound } from "next/navigation"
import { fetchPost } from "@/lib/cms-github"
import { PostForm } from "@/components/admin/PostForm"

export default async function EditLearningEntry({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetchPost("learnings", slug)
  if (!post) notFound()

  return <PostForm postType="learnings" existingPost={post} />
}
