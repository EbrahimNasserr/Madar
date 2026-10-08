import { useState, useCallback } from "react";
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

// ─── Export attendance (binary download — cannot use RTK Query) ───────────────

/**
 * Downloads the attendance sheet for a session as an .xlsx file.
 * Uses a plain fetch so we can read the binary response and trigger
 * a browser download without going through RTK Query's JSON pipeline.
 */
export function useExportAttendance() {
  const [isExporting, setIsExporting] = useState(false);

  const exportAttendance = useCallback(
    async (sessionId: string, filename: string) => {
      setIsExporting(true);
      try {
        // Lazy-import to keep SSR safe
        const { tokenStorage } = await import("@/src/lib/auth/tokenStorage");
        const token = tokenStorage.getAccessToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/attendance/session/${sessionId}/export`,
          {
            method: "GET",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) throw new Error(`Export failed: ${res.status}`);

        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportAttendance, isExporting };
}
