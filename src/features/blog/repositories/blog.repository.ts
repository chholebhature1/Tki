import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  category_name?: string;
  category_slug?: string;
  author_profile_id: string | null;
  author_name?: string;
  author_avatar?: string | null;
  reviewer_profile_id: string | null;
  reviewed_date: string | null;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  secondary_keywords: string[];
  canonical_url: string | null;
  robots: string;
  seo_notes: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  status: string;
  featured: boolean;
  featured_order: number;
  published_at: string | null;
  scheduled_at: string | null;
  published_by: string | null;
  updated_by: string | null;
  search_keywords: string[];
  deleted_at: string | null;
  views: number;
  created_at: string;
  updated_at: string;
  tags?: { id: string; name: string; slug: string }[];
  sources?: { id: string; title: string; url: string; type: string }[];
}

export interface ListPostsFilters {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export class BlogRepository {
  static async listPosts(filters: ListPostsFilters = {}): Promise<{ posts: BlogPost[]; total: number }> {
    const supabase = await createServerSupabaseClient();
    const { status, category, search, page = 1, perPage = 20 } = filters;

    let query = supabase
      .from("blog_posts")
      .select(`
        *,
        category:blog_categories(name, slug),
        author:profiles!blog_posts_author_profile_id_fkey(full_name, avatar_url)
      `, { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (status && status !== "all") query = query.eq("status", status);
    if (category) query = query.eq("category_id", category);
    if (search) query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`);

    const { data, count, error } = await query;
    if (error || !data) return { posts: [], total: 0 };

    const posts = data.map((row) => {
      const cat = row.category as unknown as { name: string; slug: string } | null;
      const author = row.author as unknown as { full_name: string; avatar_url: string | null } | null;
      return {
        ...row,
        category_name: cat?.name || null,
        category_slug: cat?.slug || null,
        author_name: author?.full_name || null,
        author_avatar: author?.avatar_url || null,
        secondary_keywords: row.secondary_keywords || [],
        search_keywords: row.search_keywords || [],
      } as BlogPost;
    });

    return { posts, total: count || 0 };
  }

  static async getPostById(id: string): Promise<BlogPost | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        category:blog_categories(name, slug),
        author:profiles!blog_posts_author_profile_id_fkey(full_name, avatar_url)
      `)
      .eq("id", id)
      .single();

    if (error || !data) return null;

    // Get tags
    const { data: tagRows } = await supabase
      .from("blog_post_tags")
      .select("tag:blog_tags(id, name, slug)")
      .eq("post_id", id);

    const tags = (tagRows || []).map((r) => (r.tag as unknown as { id: string; name: string; slug: string }));

    // Get sources
    const { data: sources } = await supabase
      .from("blog_post_sources")
      .select("id, title, url, type")
      .eq("post_id", id)
      .order("created_at");

    const cat = data.category as unknown as { name: string; slug: string } | null;
    const author = data.author as unknown as { full_name: string; avatar_url: string | null } | null;

    return {
      ...data,
      category_name: cat?.name || null,
      category_slug: cat?.slug || null,
      author_name: author?.full_name || null,
      author_avatar: author?.avatar_url || null,
      secondary_keywords: data.secondary_keywords || [],
      search_keywords: data.search_keywords || [],
      tags,
      sources: sources || [],
    } as BlogPost;
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        category:blog_categories(name, slug),
        author:profiles!blog_posts_author_profile_id_fkey(full_name, avatar_url)
      `)
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .single();

    if (error || !data) return null;

    const { data: tagRows } = await supabase
      .from("blog_post_tags")
      .select("tag:blog_tags(id, name, slug)")
      .eq("post_id", data.id);

    const tags = (tagRows || []).map((r) => (r.tag as unknown as { id: string; name: string; slug: string }));

    const { data: sources } = await supabase
      .from("blog_post_sources")
      .select("id, title, url, type")
      .eq("post_id", data.id);

    const cat = data.category as unknown as { name: string; slug: string } | null;
    const author = data.author as unknown as { full_name: string; avatar_url: string | null } | null;

    return {
      ...data,
      category_name: cat?.name || null,
      category_slug: cat?.slug || null,
      author_name: author?.full_name || null,
      author_avatar: author?.avatar_url || null,
      secondary_keywords: data.secondary_keywords || [],
      search_keywords: data.search_keywords || [],
      tags,
      sources: sources || [],
    } as BlogPost;
  }

  static async createPost(postData: Partial<BlogPost>, userId: string): Promise<{ id: string } | null> {
    const supabase = await createServerSupabaseClient();

    const { tags, sources, category_name, category_slug, author_name, author_avatar, ...insertData } = postData as BlogPost & Record<string, unknown>;

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({ ...insertData, updated_by: userId })
      .select("id")
      .single();

    if (error || !data) return null;

    // Audit log
    await supabase.from("blog_audit_logs").insert({
      entity_type: "blog_post",
      entity_id: data.id,
      action: "created",
      performed_by: userId,
    });

    return data;
  }

  static async updatePost(id: string, postData: Partial<BlogPost>, userId: string): Promise<boolean> {
    const supabase = await createServerSupabaseClient();

    // Save revision
    const { data: current } = await supabase.from("blog_posts").select("title, content").eq("id", id).single();
    if (current) {
      await supabase.from("blog_revisions").insert({ post_id: id, title: current.title, content: current.content, saved_by: userId });
    }

    const { tags, sources, category_name, category_slug, author_name, author_avatar, id: _id, ...updateData } = postData as BlogPost & Record<string, unknown>;

    const { error } = await supabase
      .from("blog_posts")
      .update({ ...updateData, updated_by: userId, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return false;

    // Audit log
    await supabase.from("blog_audit_logs").insert({
      entity_type: "blog_post",
      entity_id: id,
      action: "updated",
      performed_by: userId,
    });

    return true;
  }

  static async publishPost(id: string, userId: string): Promise<boolean> {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("blog_posts")
      .update({ status: "published", published_at: new Date().toISOString(), published_by: userId, updated_by: userId })
      .eq("id", id);

    if (error) return false;

    await supabase.from("blog_audit_logs").insert({ entity_type: "blog_post", entity_id: id, action: "published", performed_by: userId });
    return true;
  }

  static async softDeletePost(id: string, userId: string): Promise<boolean> {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("blog_posts")
      .update({ deleted_at: new Date().toISOString(), updated_by: userId })
      .eq("id", id);

    if (error) return false;

    await supabase.from("blog_audit_logs").insert({ entity_type: "blog_post", entity_id: id, action: "deleted", performed_by: userId });
    return true;
  }

  static async duplicatePost(id: string, userId: string): Promise<{ id: string } | null> {
    const supabase = await createServerSupabaseClient();

    const { data: original } = await supabase.from("blog_posts").select("*").eq("id", id).single();
    if (!original) return null;

    const { id: _id, created_at, updated_at, published_at, published_by, deleted_at, views, slug, ...copyData } = original;

    const newSlug = `${slug}-copy-${Date.now().toString(36)}`;
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({ ...copyData, title: `Copy of ${original.title}`, slug: newSlug, status: "draft", updated_by: userId })
      .select("id")
      .single();

    if (error || !data) return null;
    return data;
  }

  static async checkSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from("blog_posts").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    return !data;
  }

  static async getCategories(): Promise<{ id: string; name: string; slug: string; description: string | null; icon: string | null; color: string | null; sort_order: number }[]> {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("blog_categories").select("*").order("sort_order");
    return data || [];
  }

  static async getTags(): Promise<{ id: string; name: string; slug: string; sort_order: number }[]> {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("blog_tags").select("*").order("sort_order");
    return data || [];
  }

  static async getPublishedPosts(page = 1, perPage = 12, categorySlug?: string): Promise<{ posts: BlogPost[]; total: number }> {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("blog_posts")
      .select(`
        id, title, slug, excerpt, cover_image_url, published_at, views,
        category:blog_categories(name, slug),
        author:profiles!blog_posts_author_profile_id_fkey(full_name, avatar_url)
      `, { count: "exact" })
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (categorySlug) {
      const { data: cat } = await supabase.from("blog_categories").select("id").eq("slug", categorySlug).single();
      if (cat) query = query.eq("category_id", cat.id);
    }

    const { data, count } = await query;
    if (!data) return { posts: [], total: 0 };

    const posts = data.map((row) => {
      const cat = (row as Record<string, unknown>).category as { name: string; slug: string } | null;
      const author = (row as Record<string, unknown>).author as { full_name: string; avatar_url: string | null } | null;
      return { ...row, category_name: cat?.name, category_slug: cat?.slug, author_name: author?.full_name, author_avatar: author?.avatar_url } as unknown as BlogPost;
    });

    return { posts, total: count || 0 };
  }

  static async updatePostTags(postId: string, tagIds: string[]): Promise<void> {
    const supabase = await createServerSupabaseClient();
    await supabase.from("blog_post_tags").delete().eq("post_id", postId);
    if (tagIds.length > 0) {
      await supabase.from("blog_post_tags").insert(tagIds.map((tag_id) => ({ post_id: postId, tag_id })));
    }
  }
}
