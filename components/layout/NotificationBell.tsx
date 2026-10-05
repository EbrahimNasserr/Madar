"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { useGetUnreadCountQuery } from "@/src/lib/api/notificationsApi";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { data } = useGetUnreadCountQuery();
  const count = data?.data.count ?? 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        aria-label="الإشعارات"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />

        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
