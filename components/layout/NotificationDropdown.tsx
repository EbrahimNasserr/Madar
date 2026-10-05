"use client";

import Link from "next/link";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/src/lib/api/notificationsApi";

export default function NotificationDropdown({
  onClose,
}: {
  onClose: () => void;
}) {
  const { data, isLoading } = useGetNotificationsQuery({ page: 1, limit: 10 });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  const notifications = data?.data.notifications ?? [];

  return (
    <div className="absolute left-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="font-bold text-slate-950">الإشعارات</h3>
        <button
          onClick={() => markAllRead()}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
        >
          تحديد الكل كمقروء
        </button>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="p-6 text-center text-sm text-slate-500">
          جاري التحميل...
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-slate-900">لا توجد إشعارات</p>
          <p className="mt-1 text-xs text-slate-500">
            هنبلغك هنا بأي تحديثات مهمة.
          </p>
        </div>
      ) : (
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.map((notification) => {
            const content = (
              <div
                className={[
                  "border-b border-slate-100 px-4 py-4 transition hover:bg-slate-50",
                  !notification.read ? "bg-indigo-50/40" : "",
                ].join(" ")}
              >
                <div className="flex gap-3">
                  {!notification.read && (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {new Date(notification.createdAt).toLocaleString("ar-EG")}
                    </p>
                  </div>
                </div>
              </div>
            );

            if (notification.actionUrl) {
              return (
                <Link
                  key={notification._id}
                  href={notification.actionUrl}
                  onClick={() => {
                    markRead(notification._id);
                    onClose();
                  }}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={notification._id}
                className="w-full text-right"
                onClick={() => markRead(notification._id)}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
