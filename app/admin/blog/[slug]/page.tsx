import { notFound } from "next/navigation"
import { fetchPost } from "@/lib/cms-github"
import { PostForm } from "@/components/admin/PostForm"

export default async function EditBlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetchPost("blog", slug)
  if (!post) notFound()

  return <PostForm postType="blog" existingPost={post} />
}
