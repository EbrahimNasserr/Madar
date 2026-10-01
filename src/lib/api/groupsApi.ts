import { baseApi } from "./baseApi";
import type { Student } from "./studentsApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GroupSchedule = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type Group = {
  _id: string;
  name: string;
  subject: string;
  grade?: string;
  schoolType?: "government" | "experimental" | "private" | "other";
  billingModel: "per_session" | "monthly";
  pricePerSession?: number;
  monthlyPrice?: number;
  sessionsPerMonth?: number;
  schedule: GroupSchedule[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type CreateGroupInput = {
  name: string;
  subject: string;
  grade?: string;
  schoolType?: "government" | "experimental" | "private" | "other";
  billingModel: "per_session" | "monthly";
  pricePerSession?: number;
  monthlyPrice?: number;
  sessionsPerMonth?: number;
  schedule: GroupSchedule[];
};

export type UpdateGroupInput = Partial<CreateGroupInput> & {
  status?: "active" | "inactive";
};

// ─── Response shapes ──────────────────────────────────────────────────────────

type GroupsResponse = {
  success: boolean;
  data: { groups: Group[] };
};

type GroupResponse = {
  success: boolean;
  data: { group: Group };
};

type GroupStudentsResponse = {
  success: boolean;
  data: {
    students: {
      enrollmentId?: string;
      student: Student;
    }[];
  };
};

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const groupsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<GroupsResponse, void>({
      query: () => "/groups",
      providesTags: (result) =>
        result
          ? [
              ...result.data.groups.map((group) => ({
                type: "Groups" as const,
                id: group._id,
              })),
              { type: "Groups", id: "LIST" },
            ]
          : [{ type: "Groups", id: "LIST" }],
    }),

    getGroup: builder.query<GroupResponse, string>({
      query: (id) => `/groups/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Groups", id }],
    }),

    createGroup: builder.mutation<GroupResponse, CreateGroupInput>({
      query: (body) => ({ url: "/groups", method: "POST", body }),
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),

    updateGroup: builder.mutation<
      GroupResponse,
      { id: string; body: UpdateGroupInput }
    >({
      query: ({ id, body }) => ({
        url: `/groups/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Groups", id },
        { type: "Groups", id: "LIST" },
      ],
    }),

    deleteGroup: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/groups/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),

    getGroupStudents: builder.query<GroupStudentsResponse, string>({
      query: (groupId) => `/groups/${groupId}/students`,
      providesTags: (_result, _error, groupId) => [
        { type: "Groups", id: `STUDENTS-${groupId}` },
      ],
    }),

    addStudentToGroup: builder.mutation<
      unknown,
      { groupId: string; studentId: string }
    >({
      query: ({ groupId, studentId }) => ({
        url: `/groups/${groupId}/students`,
        method: "POST",
        body: { studentId },
      }),
      invalidatesTags: (_result, _error, { groupId }) => [
        { type: "Groups", id: `STUDENTS-${groupId}` },
      ],
    }),

    removeStudentFromGroup: builder.mutation<
      unknown,
      { groupId: string; studentId: string }
    >({
      query: ({ groupId, studentId }) => ({
        url: `/groups/${groupId}/students/${studentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { groupId }) => [
        { type: "Groups", id: `STUDENTS-${groupId}` },
      ],
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const {
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupStudentsQuery,
  useAddStudentToGroupMutation,
  useRemoveStudentFromGroupMutation,
} = groupsApi;
