import type { Feature } from "@/src/lib/api/subscriptionApi";

export const FEATURES = {
  STUDENTS:           "students",
  GROUPS:             "groups",
  SESSIONS:           "sessions",
  ATTENDANCE:         "attendance",
  PAYMENTS:           "payments",
  DASHBOARD:          "dashboard",
  QUIZZES:            "quizzes",
  GRADES:             "grades",
  ADVANCED_ANALYTICS: "advanced_analytics",
} as const satisfies Record<string, Feature>;
