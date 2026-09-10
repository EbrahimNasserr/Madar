import { baseApi } from "./baseApi";

// ─── Types (aligned with real API responses) ──────────────────────────────────

export type Student = {
  _id: string;
  teacherId?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  grade?: string;
  schoolType?: "government" | "experimental" | "private" | "other";
  notes?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt?: string;
};

export type StudentFormData = {
  firstName: string;
  lastName: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  grade?: string;
  schoolType?: Student["schoolType"];
  notes?: string;
};

type StudentsResponse = {
  success: boolean;
  data: {
    students: Student[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

type StudentResponse = {
  success: boolean;
  data: { student: Student };
};

type MutationResponse = {
  success: boolean;
  message: string;
  data: { student: Student };
};

// API error shape from the backend
export type ApiError = {
  success: false;
  code: string;
  message: string;
  errors: unknown[];
};

export type StudentsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive";
  schoolType?: Student["schoolType"];
};

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<StudentsResponse, StudentsQueryParams | void>({
      query: (params) => ({
        url: "/students",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.students.map((s) => ({
                type: "Students" as const,
                id: s._id,
              })),
              { type: "Students", id: "LIST" },
            ]
          : [{ type: "Students", id: "LIST" }],
    }),

    getStudent: builder.query<StudentResponse, string>({
      query: (id) => `/students/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Students", id }],
    }),

    createStudent: builder.mutation<MutationResponse, StudentFormData>({
      query: (body) => ({
        url: "/students",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Students", id: "LIST" }],
    }),

    updateStudent: builder.mutation<
      MutationResponse,
      { id: string; body: Partial<StudentFormData> }
    >({
      query: ({ id, body }) => ({
        url: `/students/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Students", id },
        { type: "Students", id: "LIST" },
      ],
    }),

    deleteStudent: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Students", id: "LIST" }],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
