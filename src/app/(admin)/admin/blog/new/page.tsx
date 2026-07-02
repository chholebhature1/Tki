import { BlogRepository } from "@/features/blog";
import { PostEditor } from "@/features/blog/components";

export const metadata = { title: "New Post — Admin" };

export default async function AdminNewPostPage() {
  const categories = await BlogRepository.getCategories();
  const tags = await BlogRepository.getTags();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-2xl font-bold text-text">New Post</h1>
      <PostEditor categories={categories} tags={tags} />
    </div>
  );
}
