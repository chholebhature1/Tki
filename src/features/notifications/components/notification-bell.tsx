import Link from "next/link";
import { Bell } from "lucide-react";
import { NotificationRepository } from "../repositories";

interface NotificationBellProps {
  userId: string;
  href: string;
}

export async function NotificationBell({ userId, href }: NotificationBellProps) {
  const count = await NotificationRepository.countUnread(userId);

  return (
    <Link href={href} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text" aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ""}`}>
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
