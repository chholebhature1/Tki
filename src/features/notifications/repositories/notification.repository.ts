import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  category: string | null;
  link: string | null;
  is_read: boolean;
  email_sent: boolean;
  created_at: string;
}

export class NotificationRepository {
  static async create(userId: string, data: {
    title: string; message: string; type: string; category?: string; link?: string; emailSent?: boolean;
  }): Promise<void> {
    const supabase = await createServerSupabaseClient();
    await supabase.from("notifications").insert({
      user_id: userId,
      title: data.title,
      message: data.message,
      notification_type: data.type,
      category: data.category || "general",
      link: data.link || null,
      email_sent: data.emailSent || false,
    });
  }

  static async findByUser(userId: string, limit = 20): Promise<NotificationRecord[]> {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("notifications")
      .select("id, title, message, notification_type, category, link, is_read, email_sent, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data || []) as NotificationRecord[];
  }

  static async countUnread(userId: string): Promise<number> {
    const supabase = await createServerSupabaseClient();
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);
    return count || 0;
  }

  static async markRead(id: string, userId: string): Promise<void> {
    const supabase = await createServerSupabaseClient();
    await supabase.from("notifications").update({ is_read: true, read_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId);
  }

  static async markAllRead(userId: string): Promise<void> {
    const supabase = await createServerSupabaseClient();
    await supabase.from("notifications").update({ is_read: true, read_at: new Date().toISOString() }).eq("user_id", userId).eq("is_read", false);
  }

  static async deleteOne(id: string, userId: string): Promise<void> {
    const supabase = await createServerSupabaseClient();
    await supabase.from("notifications").delete().eq("id", id).eq("user_id", userId);
  }

  static async deleteAll(userId: string): Promise<void> {
    const supabase = await createServerSupabaseClient();
    await supabase.from("notifications").delete().eq("user_id", userId);
  }
}
