import { baseApi } from "./baseApi";

export type NotificationType =
  | "trial_started"
  | "trial_ending"
  | "trial_expired"
  | "payment_succeeded"
  | "payment_failed"
  | "subscription_activated"
  | "subscription_upgraded"
  | "subscription_downgrade_scheduled"
  | "subscription_cancelled"
  | "subscription_reactivated"
  | "system";

export type Notification = {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl: string | null;
  read: boolean;
  readAt: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      {
        success: boolean;
        data: {
          notifications: Notification[];
          meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };
      },
      { page?: number; limit?: number; unreadOnly?: boolean } | void
    >({
      query: (params) => ({
        url: "/notifications",
        params: params ?? undefined,
      }),
      providesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    getUnreadCount: builder.query<
      { success: boolean; data: { count: number } },
      void
    >({
      query: () => ({ url: "/notifications/unread-count" }),
      providesTags: [{ type: "Notifications", id: "COUNT" }],
    }),

    markNotificationRead: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllNotificationsRead: builder.mutation<unknown, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteNotification: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
