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
  status: string;
  plan: "basic" | "pro";
  access: boolean;
  billingCycle: string | null;
  features: Feature[];
  trial: {
    active: boolean;
    startsAt: string | null;
    endsAt: string | null;
    daysRemaining: number;
  };
  currentPeriod: {
    startsAt: string | null;
    endsAt: string | null;
  };
  cancelAtPeriodEnd: boolean;
  nextPlan: string | null;
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
