import { baseApi } from "./baseApi";
import type { Student } from "./studentsApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AttendanceStatus = "present" | "absent" | "late";

export type AttendanceRecord = {
  _id?:   string;
  status: AttendanceStatus;
  note?:  string | null;
};

export type AttendanceSheetItem = {
  student:    Student;
  attendance: AttendanceRecord | null;
};

// ─── Response / input shapes ──────────────────────────────────────────────────

type AttendanceSheetResponse = {
  success: boolean;
  data: { students: AttendanceSheetItem[] };
};

export type SaveAttendanceInput = {
  sessionId: string;
  attendance: {
    studentId: string;
    status:    AttendanceStatus;
    note?:     string | null;
  }[];
};

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceSheet: builder.query<AttendanceSheetResponse, string>({
      query: (sessionId) => `/attendance/session/${sessionId}/sheet`,
      providesTags: (_result, _error, sessionId) => [
        { type: "Attendance", id: `SESSION-${sessionId}` },
      ],
    }),

    saveAttendanceSheet: builder.mutation<unknown, SaveAttendanceInput>({
      query: ({ sessionId, attendance }) => ({
        url:    `/attendance/session/${sessionId}/bulk`,
        method: "POST",
        body:   { attendance },
      }),
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: "Attendance", id: `SESSION-${sessionId}` },
        { type: "Dashboard",  id: "OVERVIEW"             },
        { type: "Dashboard",  id: "ATTENDANCE_TREND"     },
        { type: "Dashboard",  id: "GROUPS_PERFORMANCE"   },
      ],
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const {
  useGetAttendanceSheetQuery,
  useSaveAttendanceSheetMutation,
} = attendanceApi;
