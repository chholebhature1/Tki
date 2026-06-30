"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NotificationRepository } from "../repositories";

async function getUserId(): Promise<string | null> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

export async function markNotificationReadAction(id: string) {
  const userId = await getUserId();
  if (!userId) return;
  await NotificationRepository.markRead(id, userId);
}

export async function markAllNotificationsReadAction() {
  const userId = await getUserId();
  if (!userId) return;
  await NotificationRepository.markAllRead(userId);
}

export async function deleteNotificationAction(id: string) {
  const userId = await getUserId();
  if (!userId) return;
  await NotificationRepository.deleteOne(id, userId);
}

export async function deleteAllNotificationsAction() {
  const userId = await getUserId();
  if (!userId) return;
  await NotificationRepository.deleteAll(userId);
}
