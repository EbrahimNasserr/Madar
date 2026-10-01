import { baseApi } from "./baseApi";
import type { Group } from "./groupsApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SessionStatus = "scheduled" | "completed" | "cancelled";

export type Session = {
  _id: string;
  teacherId?: string;
  groupId: string | Group;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateSessionInput = {
  groupId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

export type UpdateSessionInput = Partial<{
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  notes: string | null;
}>;

// ─── Response shapes ──────────────────────────────────────────────────────────

type SessionResponse = {
  success: boolean;
  data: { session: Session };
};

type SessionsResponse = {
  success: boolean;
  data: { sessions: Session[] };
};

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const sessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroupSessions: builder.query<SessionsResponse, string>({
      query: (groupId) => `/sessions/group/${groupId}`,
      providesTags: (result, _error, groupId) =>
        result
          ? [
              ...result.data.sessions.map((s) => ({
                type: "Sessions" as const,
                id: s._id,
              })),
              { type: "Sessions", id: `GROUP-${groupId}` },
            ]
          : [{ type: "Sessions", id: `GROUP-${groupId}` }],
    }),

    getSession: builder.query<SessionResponse, string>({
      query: (id) => `/sessions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Sessions", id }],
    }),

    createSession: builder.mutation<SessionResponse, CreateSessionInput>({
      query: (body) => ({ url: "/sessions", method: "POST", body }),
      invalidatesTags: (_result, _error, body) => [
        { type: "Sessions", id: `GROUP-${body.groupId}` },
      ],
    }),

    updateSession: builder.mutation<
      SessionResponse,
      { id: string; groupId: string; body: UpdateSessionInput }
    >({
      query: ({ id, body }) => ({ url: `/sessions/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id, groupId }) => [
        { type: "Sessions", id },
        { type: "Sessions", id: `GROUP-${groupId}` },
      ],
    }),

    cancelSession: builder.mutation<unknown, { id: string; groupId: string }>({
      query: ({ id }) => ({ url: `/sessions/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { id, groupId }) => [
        { type: "Sessions", id },
        { type: "Sessions", id: `GROUP-${groupId}` },
      ],
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const {
  useGetGroupSessionsQuery,
  useGetSessionQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useCancelSessionMutation,
} = sessionsApi;
