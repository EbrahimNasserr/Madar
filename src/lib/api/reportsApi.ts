import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReportOverview = {
  period: string;
  financial: {
    expectedAmount: number;
    collectedAmount: number;
    outstandingAmount: number;
    totalExpenses: number;
    netIncome: number;
    collectionRate: number;
  };
  attendance: {
    present: number;
    late: number;
    absent: number;
    total: number;
    attendanceRate: number;
  };
  sessions: { total: number };
  groups: { total: number };
};

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewReport: builder.query<
      { success: boolean; data: ReportOverview },
      string
    >({
      query: (period) => ({
        url: "/reports/overview",
        params: { period },
      }),
      providesTags: [{ type: "Reports", id: "OVERVIEW" }],
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const { useGetOverviewReportQuery } = reportsApi;
