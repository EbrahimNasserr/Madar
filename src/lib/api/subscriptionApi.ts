import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Feature =
  | "students"
  | "groups"
  | "sessions"
  | "attendance"
  | "payments"
  | "dashboard"
  | "quizzes"
  | "grades"
  | "advanced_analytics";

export type SubscriptionData = {
  plan: "basic" | "pro";
  subscriptionPlan: "basic" | "pro";
  status: string;
  features: Feature[];
  pro: {
    enabled: boolean;
    expiresAt: string | null;
    trialEndsAt: string | null;
    cancelAtPeriodEnd: boolean;
  };
};

export type SubscriptionResponse = {
  success: boolean;
  data: {
    subscription: SubscriptionData;
  };
};

// ─── Subscription endpoints ───────────────────────────────────────────────────

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query<SubscriptionResponse, void>({
      query: () => "/subscriptions/me",
      providesTags: ["Subscription"],
    }),
  }),
});

export const { useGetSubscriptionQuery } = subscriptionApi;
