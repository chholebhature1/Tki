"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BlogRepository } from "../repositories";

interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

export async function createPostAction(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  category_id?: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  secondary_keywords?: string[];
  canonical_url?: string;
  robots?: string;
  seo_notes?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  status?: string;
  featured?: boolean;
  featured_order?: number;
  scheduled_at?: string;
  search_keywords?: string[];
  reviewer_profile_id?: string;
  reviewed_date?: string;
  tag_ids?: string[];
}): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  if (!data.title || !data.slug || !data.content) {
    return { success: false, error: "Title, slug, and content are required." };
  }

  const slugAvailable = await BlogRepository.checkSlugAvailable(data.slug);
  if (!slugAvailable) return { success: false, error: "Slug already exists." };

  const { tag_ids, ...postData } = data;
  const result = await BlogRepository.createPost(
    { ...postData, author_profile_id: user.id } as never,
    user.id
  );

  if (!result) return { success: false, error: "Failed to create post." };

  if (tag_ids && tag_ids.length > 0) {
    await BlogRepository.updatePostTags(result.id, tag_ids);
  }

  return { success: true, id: result.id };
}

export async function updatePostAction(id: string, data: Record<string, unknown>): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { tag_ids, ...postData } = data;

  if (postData.slug) {
    const slugAvailable = await BlogRepository.checkSlugAvailable(postData.slug as string, id);
    if (!slugAvailable) return { success: false, error: "Slug already exists." };
  }

  const success = await BlogRepository.updatePost(id, postData as never, user.id);
  if (!success) return { success: false, error: "Failed to update post." };

  if (tag_ids) {
    await BlogRepository.updatePostTags(id, tag_ids as string[]);
  }

  return { success: true, id };
}

export async function publishPostAction(id: string): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const success = await BlogRepository.publishPost(id, user.id);
  return success ? { success: true } : { success: false, error: "Failed to publish." };
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const success = await BlogRepository.softDeletePost(id, user.id);
  return success ? { success: true } : { success: false, error: "Failed to delete." };
}

export async function duplicatePostAction(id: string): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const result = await BlogRepository.duplicatePost(id, user.id);
  return result ? { success: true, id: result.id } : { success: false, error: "Failed to duplicate." };
}

export async function createCategoryAction(name: string, slug: string, description?: string, icon?: string, color?: string): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("blog_categories")
    .insert({ name, slug, description, icon, color })
    .select("id")
    .single();

  if (error) return { success: false, error: error.code === "23505" ? "Slug already exists." : "Failed to create." };
  return { success: true, id: data.id };
}

export async function createTagAction(name: string, slug: string): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("blog_tags")
    .insert({ name, slug })
    .select("id")
    .single();

  if (error) return { success: false, error: error.code === "23505" ? "Slug already exists." : "Failed to create." };
  return { success: true, id: data.id };
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("blog_categories").delete().eq("id", id);
  return error ? { success: false, error: "Failed to delete." } : { success: true };
}

export async function deleteTagAction(id: string): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("blog_tags").delete().eq("id", id);
  return error ? { success: false, error: "Failed to delete." } : { success: true };
}
