import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlanId = "basic" | "pro";
export type BillingCycle = "monthly" | "yearly";

export type BillingPlan = {
  id: PlanId;
  name: string;
  currency: string;
  prices: {
    monthly: number | null;
    yearly: number | null;
  };
  features: string[];
};

export type BillingTransaction = {
  id: string;
  plan: PlanId;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  paidAt: string | null;
  createdAt: string;
};

// ─── Billing endpoints ────────────────────────────────────────────────────────

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBillingPlans: builder.query<
      { success: boolean; data: { plans: BillingPlan[] } },
      void
    >({
      query: () => ({ url: "/billing/plans" }),
      providesTags: [{ type: "Billing", id: "PLANS" }],
    }),

    createCheckout: builder.mutation<
      {
        success: boolean;
        data: {
          transactionId: string;
          reference: string;
          checkoutUrl: string;
        };
      },
      { plan: PlanId; billingCycle: BillingCycle }
    >({
      query: (body) => ({
        url: "/billing/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Billing", id: "HISTORY" }],
    }),

    getBillingHistory: builder.query<
      { success: boolean; data: { transactions: BillingTransaction[] } },
      void
    >({
      query: () => ({ url: "/billing/history" }),
      providesTags: [{ type: "Billing", id: "HISTORY" }],
    }),
  }),
});

export const {
  useGetBillingPlansQuery,
  useCreateCheckoutMutation,
  useGetBillingHistoryQuery,
} = billingApi;
