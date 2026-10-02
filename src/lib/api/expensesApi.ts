import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ExpenseCategory =
  | "rent"
  | "printing"
  | "transportation"
  | "supplies"
  | "advertising"
  | "assistant"
  | "internet"
  | "other";

export type Expense = {
  _id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  expenseDate: string;
  paymentMethod: "cash" | "bank_transfer" | "instapay" | "other";
  notes?: string | null;
  status: "active" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

export type CreateExpenseInput = {
  title: string;
  amount: number;
  category: ExpenseCategory;
  expenseDate: string;
  paymentMethod: "cash" | "bank_transfer" | "instapay" | "other";
  notes?: string;
};

// ─── Response shapes ──────────────────────────────────────────────────────────

type ExpensesResponse = {
  success: boolean;
  data: {
    expenses: Expense[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

type ExpenseSummaryResponse = {
  success: boolean;
  data: {
    period: string;
    totalExpenses: number;
    count: number;
    byCategory: {
      category: ExpenseCategory;
      amount: number;
      count: number;
    }[];
    recentExpenses: Expense[];
  };
};

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<
      ExpensesResponse,
      { page?: number; limit?: number; period?: string; category?: ExpenseCategory }
    >({
      query: (params) => ({ url: "/expenses", params }),
      providesTags: [{ type: "Expenses", id: "LIST" }],
    }),

    getExpenseSummary: builder.query<ExpenseSummaryResponse, string>({
      query: (period) => ({ url: "/expenses/summary", params: { period } }),
      providesTags: [{ type: "Expenses", id: "SUMMARY" }],
    }),

    createExpense: builder.mutation<unknown, CreateExpenseInput>({
      query: (body) => ({ url: "/expenses", method: "POST", body }),
      invalidatesTags: [
        { type: "Expenses",  id: "LIST"     },
        { type: "Expenses",  id: "SUMMARY"  },
        { type: "Dashboard", id: "OVERVIEW" },
        { type: "Dashboard", id: "FINANCIAL_TREND" },
        { type: "Reports",   id: "OVERVIEW" },
      ],
    }),

    updateExpense: builder.mutation<
      unknown,
      { id: string; body: Partial<CreateExpenseInput> }
    >({
      query: ({ id, body }) => ({ url: `/expenses/${id}`, method: "PATCH", body }),
      invalidatesTags: [
        { type: "Expenses",  id: "LIST"     },
        { type: "Expenses",  id: "SUMMARY"  },
        { type: "Dashboard", id: "OVERVIEW" },
        { type: "Dashboard", id: "FINANCIAL_TREND" },
        { type: "Reports",   id: "OVERVIEW" },
      ],
    }),

    cancelExpense: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/expenses/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Expenses",  id: "LIST"     },
        { type: "Expenses",  id: "SUMMARY"  },
        { type: "Dashboard", id: "OVERVIEW" },
        { type: "Dashboard", id: "FINANCIAL_TREND" },
        { type: "Reports",   id: "OVERVIEW" },
      ],
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const {
  useGetExpensesQuery,
  useGetExpenseSummaryQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useCancelExpenseMutation,
} = expensesApi;
