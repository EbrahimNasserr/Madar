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
        { type: "Quizzes", id: quizId },
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
} = quizzesApi;
