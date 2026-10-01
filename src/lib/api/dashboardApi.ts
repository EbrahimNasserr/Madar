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
    group: { _id: string; name: string; subject?: string; grade?: string };
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

// ─── Raw API shapes (what the server actually returns) ────────────────────────

type RawOverviewResponse = {
  success: boolean;
  data: {
    period: string;
    stats: {
      activeStudents:   number;
      activeGroups:     number;
      todaySessions:    number;
      attendanceRate:   number;
      expectedAmount:   number;
      collectedAmount:  number;
      outstandingAmount: number;
      collectionRate:   number;
    };
    sessions: {
      summary: { total: number; scheduled: number; completed: number };
      today: {
        sessionId:   string;
        group:       { _id: string; name: string; subject?: string; grade?: string };
        sessionDate: string;
        startTime:   string;
        endTime:     string;
        status:      "scheduled" | "completed" | "cancelled";
      }[];
    };
    attendance: {
      present:        number;
      absent:         number;
      late:           number;
      totalMarked:    number;
      attendanceRate: number;
    };
    payments: {
      summary: {
        expectedAmount:   number;
        collectedAmount:  number;
        outstandingAmount: number;
        collectionRate:   number;
      };
      status:  { paid: number; partial: number; pending: number };
      recent:  {
        paymentId:      string;
        student?:       { _id: string; firstName: string; lastName: string; phone?: string };
        group?:         { _id: string; name: string; subject?: string };
        type:           "session" | "monthly" | "manual";
        billingPeriod?: string | null;
        amount:         number;
        paidAmount:     number;
        remainingAmount?: number;
        status:         "pending" | "partial" | "paid" | "cancelled";
        paymentMethod?: string;
        paymentDate?:   string;
        updatedAt:      string;
      }[];
    };
  };
};

type RawGroupPerformanceItem = {
  group: {
    _id:          string;
    name:         string;
    subject?:     string;
    grade?:       string;
    billingModel?: string;
  };
  students:  number;
  sessions:  number;
  attendance: {
    present:        number;
    late:           number;
    absent:         number;
    attendanceRate: number;
  };
  payments: {
    expectedAmount:   number;
    collectedAmount:  number;
    outstandingAmount: number;
    collectionRate:   number;
  };
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
      // API returns deeply nested stats/sessions/attendance/payments
      // — normalize into the flat DashboardOverview shape the UI expects
      transformResponse: (raw: RawOverviewResponse): OverviewResponse => {
        const { stats, sessions, attendance, payments } = raw.data;
        return {
          success: raw.success,
          data: {
            activeStudents: stats.activeStudents,
            activeGroups:   stats.activeGroups,

            todaySessions: {
              total:     sessions.summary.total,
              scheduled: sessions.summary.scheduled,
              completed: sessions.summary.completed,
            },

            todayAttendance: {
              present:        attendance.present,
              late:           attendance.late,
              absent:         attendance.absent,
              total:          attendance.totalMarked,
              attendanceRate: attendance.attendanceRate,
            },

            financial: {
              expectedAmount:    payments.summary.expectedAmount,
              collectedAmount:   payments.summary.collectedAmount,
              outstandingAmount: payments.summary.outstandingAmount,
              collectionRate:    payments.summary.collectionRate,
            },

            paymentStatus: payments.status,
            recentPayments: (payments.recent ?? []).map((p) => ({
              _id:           p.paymentId,
              student:       p.student,
              group:         p.group,
              amount:        p.amount,
              paidAmount:    p.paidAmount,
              status:        p.status,
              type:          p.type,
              billingPeriod: p.billingPeriod,
              updatedAt:     p.updatedAt,
            })),
            sessions:       (sessions.today ?? []).map((s) => ({
              _id:         s.sessionId,
              group:       s.group,
              sessionDate: s.sessionDate,
              startTime:   s.startTime,
              endTime:     s.endTime,
              status:      s.status,
            })),
          },
        };
      },
      providesTags: [{ type: "Dashboard", id: "OVERVIEW" }],
    }),

    getFinancialTrend: builder.query<FinancialTrendResponse, number>({
      query: (months) => ({ url: "/dashboard/financial-trend", params: { months } }),
      // API returns { data: { months: [...] } } — normalize to { data: { trend: [...] } }
      transformResponse: (raw: { success: boolean; data: { months: FinancialTrendItem[] } }): FinancialTrendResponse => ({
        success: raw.success,
        data: { trend: raw.data.months ?? [] },
      }),
      providesTags: [{ type: "Dashboard", id: "FINANCIAL_TREND" }],
    }),

    getAttendanceTrend: builder.query<AttendanceTrendResponse, number>({
      query: (days) => ({ url: "/dashboard/attendance-trend", params: { days } }),
      // API returns { data: { days: [...] } } — normalize to { data: { trend: [...] } }
      transformResponse: (raw: { success: boolean; data: { days: AttendanceTrendItem[] } }): AttendanceTrendResponse => ({
        success: raw.success,
        data: { trend: raw.data.days ?? [] },
      }),
      providesTags: [{ type: "Dashboard", id: "ATTENDANCE_TREND" }],
    }),

    getGroupsPerformance: builder.query<GroupsPerformanceResponse, string>({
      query: (period) => ({ url: "/dashboard/groups-performance", params: { period } }),
      // API returns nested shape — normalize to flat GroupPerformanceItem
      transformResponse: (raw: { success: boolean; data: { period: string; groups: RawGroupPerformanceItem[] } }): GroupsPerformanceResponse => ({
        success: raw.success,
        data: {
          groups: (raw.data.groups ?? []).map((item) => ({
            groupId:           item.group._id,
            groupName:         item.group.name,
            subject:           item.group.subject,
            studentsCount:     item.students,
            sessionsCount:     item.sessions,
            attendanceRate:    item.attendance.attendanceRate,
            expectedAmount:    item.payments.expectedAmount,
            collectedAmount:   item.payments.collectedAmount,
            outstandingAmount: item.payments.outstandingAmount,
            collectionRate:    item.payments.collectionRate,
          })),
        },
      }),
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
