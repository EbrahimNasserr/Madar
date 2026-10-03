import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Feature =
  | "students"
  | "groups"
  | "sessions"
  | "attendance"
  | "payments"
  | "expenses"
  | "dashboard"
  | "reports"
  | "quizzes"
  | "grades"
  | "advanced_analytics";

export type SubscriptionStatus =
  | "trial"
  | "trial_expired"
  | "active"
  | "past_due"
  | "expired"
  | "cancelled";

export type SubscriptionData = {
  status: SubscriptionStatus;
  plan: "basic" | "pro" | null;
  access: boolean;
  billingCycle: "monthly" | "yearly" | null;
  features: Feature[];
  trial: {
    active: boolean;
    startsAt?: string;
    endsAt?: string;
    daysRemaining?: number;
  };
  currentPeriod: {
    startsAt: string | null;
    endsAt: string | null;
  };
  cancelAtPeriodEnd: boolean;
  nextPlan: "basic" | "pro" | null;
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
