import { baseApi } from "./baseApi";
import type { Student } from "./studentsApi";
import type { Group } from "./groupsApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuizStatus = "draft" | "published" | "archived";

export type Quiz = {
  _id: string;
  groupId: string | Group;
  title: string;
  description?: string | null;
  quizDate: string;
  totalMarks: number;
  status: QuizStatus;
  createdAt: string;
  updatedAt: string;
};

export type QuizResultStatus = "graded" | "absent";

export type QuizResult = {
  _id?: string;
  studentId: string | Student;
  score: number;
  percentage: number;
  status: QuizResultStatus;
  note?: string | null;
};

export type QuizSheetItem = {
  student: Student;
  result: QuizResult | null;
};

// ─── Performance types ────────────────────────────────────────────────────────

export type StudentQuizHistoryItem = {
  quizId: string;
  quizTitle: string;
  quizDate: string;
  group: {
    _id: string;
    name: string;
    subject: string;
    grade?: string;
  };
  status: "graded" | "absent";
  score: number;
  percentage: number;
};

export type StudentQuizPerformance = {
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    grade?: string;
  };
  summary: {
    totalQuizzes: number;
    gradedCount: number;
    absentCount: number;
    averagePercentage: number;
    bestPercentage: number;
    lowestPercentage: number;
    latestPercentage: number;
    trendDirection: "improving" | "stable" | "declining" | null;
  };
  trend: StudentQuizHistoryItem[]; // API calls the history array "trend"
};

export type GroupQuizPerformanceItem = {
  quizId: string;
  title: string;        // API returns "title", not "quizTitle"
  quizDate: string;
  totalMarks: number;
  averagePercentage: number;
  graded: number;       // API returns "graded", not "gradedCount"
  absent: number;       // API returns "absent", not "absentCount"
};

export type GroupStudentPerformanceEntry = {
  rank: number;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    grade?: string;
  };
  gradedCount: number;
  absentCount: number;
  averagePercentage: number;
};

export type GroupQuizPerformance = {
  group: {
    _id: string;
    name: string;
    subject: string;
    grade?: string;
    status: string;
  };
  period: string;
  summary: {
    totalQuizzes: number;
    gradedResults: number;
    absentResults: number;
    averagePercentage: number;
    topPercentage: number;
  };
  quizzes: GroupQuizPerformanceItem[];
  students: GroupStudentPerformanceEntry[];
  topPerformers: GroupStudentPerformanceEntry[];
  needsAttention: GroupStudentPerformanceEntry[];
};

// ─── Response shapes ──────────────────────────────────────────────────────────

type QuizzesResponse = {
  success: boolean;
  data: { quizzes: Quiz[] };
};

type QuizResponse = {
  success: boolean;
  data: { quiz: Quiz };
};

type QuizSheetResponse = {
  success: boolean;
  data: {
    quiz: Quiz;
    students: QuizSheetItem[];
  };
};

type StudentQuizHistoryResponse = {
  success: boolean;
  data: { history: StudentQuizHistoryItem[] };
};

type StudentQuizPerformanceResponse = {
  success: boolean;
  data: StudentQuizPerformance;
};

type GroupQuizPerformanceResponse = {
  success: boolean;
  data: GroupQuizPerformance;
};

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const quizzesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query<QuizzesResponse, void>({
      query: () => "/quizzes",
      providesTags: (result) =>
        result
          ? [
              ...result.data.quizzes.map((quiz) => ({
                type: "Quizzes" as const,
                id: quiz._id,
              })),
              { type: "Quizzes", id: "LIST" },
            ]
          : [{ type: "Quizzes", id: "LIST" }],
    }),

    getQuiz: builder.query<QuizResponse, string>({
      query: (quizId) => `/quizzes/${quizId}`,
      providesTags: (_result, _error, quizId) => [
        { type: "Quizzes", id: quizId },
      ],
    }),

    createQuiz: builder.mutation<
      QuizResponse,
      {
        groupId: string;
        title: string;
        description?: string;
        quizDate: string;
        totalMarks: number;
      }
    >({
      query: (body) => ({ url: "/quizzes", method: "POST", body }),
      invalidatesTags: [{ type: "Quizzes", id: "LIST" }],
    }),

    updateQuiz: builder.mutation<
      QuizResponse,
      {
        quizId: string;
        body: Partial<{
          title: string;
          description: string;
          quizDate: string;
          totalMarks: number;
          status: QuizStatus;
        }>;
      }
    >({
      query: ({ quizId, body }) => ({
        url: `/quizzes/${quizId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { quizId }) => [
        { type: "Quizzes", id: quizId },
        { type: "Quizzes", id: "LIST" },
      ],
    }),

    archiveQuiz: builder.mutation<unknown, string>({
      query: (quizId) => ({
        url: `/quizzes/${quizId}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Quizzes", id: "LIST" }],
    }),

    getQuizSheet: builder.query<QuizSheetResponse, string>({
      query: (quizId) => `/quizzes/${quizId}/sheet`,
      providesTags: (_result, _error, quizId) => [
        { type: "Quizzes", id: `SHEET-${quizId}` },
      ],
    }),

    saveQuizResults: builder.mutation<
      unknown,
      {
        quizId: string;
        results: {
          studentId: string;
          score: number;
          status: QuizResultStatus;
          note?: string;
        }[];
      }
    >({
      query: ({ quizId, results }) => ({
        url: `/quizzes/${quizId}/results/bulk`,
        method: "POST",
        body: { results },
      }),
      invalidatesTags: (_result, _error, { quizId }) => [
        { type: "Quizzes", id: `SHEET-${quizId}` },
        { type: "Quizzes", id: `STATISTICS-${quizId}` },
        { type: "Quizzes", id: quizId },
        { type: "Quizzes", id: "LIST" },
      ],
    }),

    getStudentQuizHistory: builder.query<StudentQuizHistoryResponse, string>({
      query: (studentId) => `/quizzes/student/${studentId}/history`,
      providesTags: (_result, _error, studentId) => [
        { type: "Quizzes", id: `STUDENT-HISTORY-${studentId}` },
      ],
    }),

    getStudentQuizPerformance: builder.query<StudentQuizPerformanceResponse, string>({
      query: (studentId) => `/quizzes/student/${studentId}/performance`,
      providesTags: (_result, _error, studentId) => [
        { type: "Quizzes", id: `STUDENT-PERFORMANCE-${studentId}` },
      ],
    }),

    getGroupQuizPerformance: builder.query<
      GroupQuizPerformanceResponse,
      { groupId: string; period?: string }
    >({
      query: ({ groupId, period }) => ({
        url: `/quizzes/group/${groupId}/performance`,
        params: period ? { period } : undefined,
      }),
      providesTags: (_result, _error, { groupId, period }) => [
        { type: "Quizzes", id: `GROUP-PERFORMANCE-${groupId}-${period ?? "ALL"}` },
      ],
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const {
  useGetQuizzesQuery,
  useGetQuizQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useArchiveQuizMutation,
  useGetQuizSheetQuery,
  useSaveQuizResultsMutation,
  useGetStudentQuizHistoryQuery,
  useGetStudentQuizPerformanceQuery,
  useGetGroupQuizPerformanceQuery,
} = quizzesApi;
