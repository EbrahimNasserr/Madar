import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DashboardOverview = {
  activeStudents: number;
  activeGroups:   number;

  todaySessions: {
    total:     number;
    scheduled: number;
    completed: number;
    cancelled?: number;
  };

  todayAttendance: {
    present:        number;
    late:           number;
    absent:         number;
    total:          number;
    attendanceRate: number;
  };

  financial: {
    expectedAmount:   number;
    collectedAmount:  number;
    outstandingAmount: number;
    collectionRate:   number;
  };

  paymentStatus: {
    paid:    number;
    partial: number;
    pending: number;
  };

  recentPayments: {
    _id: string;
    student?: { _id: string; firstName: string; lastName: string };
    group?:   { _id: string; name: string };
    amount:        number;
    paidAmount:    number;
    status:        "pending" | "partial" | "paid" | "cancelled";
    type:          "session" | "monthly" | "manual";
    billingPeriod?: string | null;
    updatedAt:     string;
  }[];

  sessions: {
    _id: string;
    groupId: string | { _id: string; name: string; subject?: string };
    sessionDate: string;
    startTime:   string;
    endTime:     string;
    status: "scheduled" | "completed" | "cancelled";
  }[];
};

export type FinancialTrendItem = {
  period:            string;
  expectedAmount:    number;
  collectedAmount:   number;
  outstandingAmount: number;
};

export type AttendanceTrendItem = {
  date:           string;
  present:        number;
  late:           number;
  absent:         number;
  total:          number;
  attendanceRate: number;
};

export type GroupPerformanceItem = {
  groupId:          string;
  groupName:        string;
  subject?:         string;
  studentsCount:    number;
  sessionsCount:    number;
  attendanceRate:   number;
  expectedAmount:   number;
  collectedAmount:  number;
  outstandingAmount: number;
  collectionRate:   number;
};

// ─── Response shapes ──────────────────────────────────────────────────────────

type OverviewResponse = {
  success: boolean;
  data:    DashboardOverview;
};

type FinancialTrendResponse = {
  success: boolean;
  data: { trend: FinancialTrendItem[] };
};

type AttendanceTrendResponse = {
  success: boolean;
  data: { trend: AttendanceTrendItem[] };
};

type GroupsPerformanceResponse = {
  success: boolean;
  data: { groups: GroupPerformanceItem[] };
};

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<OverviewResponse, string>({
      query: (period) => ({ url: "/dashboard/overview", params: { period } }),
      providesTags: [{ type: "Dashboard", id: "OVERVIEW" }],
    }),

    getFinancialTrend: builder.query<FinancialTrendResponse, number>({
      query: (months) => ({ url: "/dashboard/financial-trend", params: { months } }),
      providesTags: [{ type: "Dashboard", id: "FINANCIAL_TREND" }],
    }),

    getAttendanceTrend: builder.query<AttendanceTrendResponse, number>({
      query: (days) => ({ url: "/dashboard/attendance-trend", params: { days } }),
      providesTags: [{ type: "Dashboard", id: "ATTENDANCE_TREND" }],
    }),

    getGroupsPerformance: builder.query<GroupsPerformanceResponse, string>({
      query: (period) => ({ url: "/dashboard/groups-performance", params: { period } }),
      providesTags: [{ type: "Dashboard", id: "GROUPS_PERFORMANCE" }],
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const {
  useGetDashboardOverviewQuery,
  useGetFinancialTrendQuery,
  useGetAttendanceTrendQuery,
  useGetGroupsPerformanceQuery,
} = dashboardApi;
