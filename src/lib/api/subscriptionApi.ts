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

export type SubscriptionResponse = {
  success: boolean;
  data: {
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
