import { redirect } from "next/navigation";

export const metadata = { title: "Settings — TalkIndia Pro" };

/**
 * Settings has been merged into the Profile page.
 * This route redirects to avoid broken bookmarks.
 */
export default function TherapistSettingsPage() {
  redirect("/therapist/profile");
}
