import { baseApi } from "./baseApi";
import type { Student } from "./studentsApi";
import type { Group } from "./groupsApi";
import type { Session } from "./sessionsApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentStatus = "pending" | "partial" | "paid" | "cancelled";

export type PaymentType = "session" | "monthly" | "manual";

export type Payment = {
  _id: string;
  studentId:      string | Student;
  groupId:        string | Group;
  sessionId?:     string | Session | null;
  amount:         number;
  paidAmount:     number;
  status:         PaymentStatus;
  paymentMethod:  "cash" | "bank_transfer" | "instapay" | "other";
  type:           PaymentType;
  billingPeriod?: string | null;
  paymentDate?:   string | null;
  notes?:         string | null;
  createdAt: string;
  updatedAt: string;
};

// Alias — session payments are just Payment objects
export type SessionPayment = Payment;

export type LedgerItem = {
  paymentId:       string;
  student:         Student;
  amount:          number;
  paidAmount:      number;
  remainingAmount: number;
  status:          PaymentStatus;
  paymentMethod:   string;
  paymentDate?:    string | null;
};

// ─── Response shapes ──────────────────────────────────────────────────────────

export type PaymentLedgerResponse = {
  success: boolean;
  data: {
    group:         Group;
    billingPeriod: string;
    summary: {
      totalStudents:     number;
      totalAmount:       number;
      paidAmount:        number;
      outstandingAmount: number;
      paidCount:         number;
      partialCount:      number;
      pendingCount:      number;
    };
    ledger: LedgerItem[];
  };
};

type SessionPaymentsResponse = {
  success: boolean;
  data: { payments: SessionPayment[] };
};

type CreateSessionPaymentResponse = {
  success: boolean;
  data: { payment: Payment };
};

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Group monthly ledger ────────────────────────────────────────────────

    getGroupPaymentLedger: builder.query<
      PaymentLedgerResponse,
      { groupId: string; billingPeriod: string }
    >({
      query: ({ groupId, billingPeriod }) => ({
        url:    `/payments/group/${groupId}/ledger`,
        params: { billingPeriod },
      }),
      providesTags: (_result, _error, { groupId, billingPeriod }) => [
        { type: "Payments", id: `LEDGER-${groupId}-${billingPeriod}` },
      ],
    }),

    generateMonthlyPayments: builder.mutation<
      unknown,
      { groupId: string; billingPeriod: string }
    >({
      query: ({ groupId, billingPeriod }) => ({
        url:    `/payments/group/${groupId}/monthly`,
        method: "POST",
        body:   { billingPeriod },
      }),
      invalidatesTags: (_result, _error, { groupId, billingPeriod }) => [
        { type: "Payments",  id: `LEDGER-${groupId}-${billingPeriod}` },
        { type: "Dashboard", id: "OVERVIEW"           },
        { type: "Dashboard", id: "FINANCIAL_TREND"    },
        { type: "Dashboard", id: "GROUPS_PERFORMANCE" },
        { type: "Reports",   id: "OVERVIEW"           },
      ],
    }),

    // ── Session payments ────────────────────────────────────────────────────

    getSessionPayments: builder.query<SessionPaymentsResponse, string>({
      query: (sessionId) => `/payments/session/${sessionId}`,
      providesTags: (_result, _error, sessionId) => [
        { type: "Payments", id: `SESSION-${sessionId}` },
      ],
    }),

    createSessionPayment: builder.mutation<
      CreateSessionPaymentResponse,
      { sessionId: string; studentId: string }
    >({
      query: ({ sessionId, studentId }) => ({
        url:    `/payments/session/${sessionId}`,
        method: "POST",
        body:   { studentId },
      }),
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: "Payments", id: `SESSION-${sessionId}` },
      ],
    }),

    // ── Pay / cancel ────────────────────────────────────────────────────────

    payPayment: builder.mutation<
      unknown,
      {
        paymentId:      string;
        amount:         number;
        paymentMethod:  "cash" | "bank_transfer" | "instapay" | "other";
        notes?:         string;
        sessionId?:     string;   // invalidates session payment list
        groupId?:       string;   // invalidates monthly ledger
        billingPeriod?: string;
      }
    >({
      query: ({ paymentId, amount, paymentMethod, notes }) => ({
        url:    `/payments/${paymentId}/pay`,
        method: "PATCH",
        body:   { amount, paymentMethod, notes },
      }),
      invalidatesTags: (_result, _error, args) => {
        const tags: { type: "Payments" | "Dashboard" | "Reports"; id: string }[] = []

        if (args.sessionId) {
          tags.push({ type: "Payments", id: `SESSION-${args.sessionId}` })
        }
        if (args.groupId && args.billingPeriod) {
          tags.push({ type: "Payments", id: `LEDGER-${args.groupId}-${args.billingPeriod}` })
        }
        if (tags.length === 0) {
          return ["Payments" as const]
        }
        // Always refresh dashboard financial numbers after any payment
        tags.push({ type: "Dashboard", id: "OVERVIEW"           })
        tags.push({ type: "Dashboard", id: "FINANCIAL_TREND"    })
        tags.push({ type: "Dashboard", id: "GROUPS_PERFORMANCE" })
        tags.push({ type: "Reports",   id: "OVERVIEW"           })
        return tags
      },
    }),

    cancelPayment: builder.mutation<unknown, string>({
      query: (paymentId) => ({
        url:    `/payments/${paymentId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payments", { type: "Reports", id: "OVERVIEW" }],
    }),

    // ── Student history ─────────────────────────────────────────────────────

    getStudentPayments: builder.query<
      {
        success: boolean;
        data: {
          student: Student;
          summary: {
            totalAmount:      number;
            totalPaid:        number;
            totalOutstanding: number;
          };
          payments: Payment[];
        };
      },
      string
    >({
      query: (studentId) => `/payments/student/${studentId}`,
      providesTags: (_result, _error, studentId) => [
        { type: "Payments", id: `STUDENT-${studentId}` },
      ],
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const {
  useGetGroupPaymentLedgerQuery,
  useGenerateMonthlyPaymentsMutation,
  useGetSessionPaymentsQuery,
  useCreateSessionPaymentMutation,
  usePayPaymentMutation,
  useCancelPaymentMutation,
  useGetStudentPaymentsQuery,
} = paymentsApi;
