// ─── Feature label map ────────────────────────────────────────────────────────

export function featureLabel(feature: string): string {
  const labels: Record<string, string> = {
    students:           "إدارة الطلاب",
    groups:             "المجموعات",
    sessions:           "الحصص",
    attendance:         "الحضور",
    payments:           "المدفوعات",
    expenses:           "المصروفات",
    dashboard:          "لوحة التحكم",
    reports:            "التقارير",
    quizzes:            "الاختبارات",
    grades:             "الدرجات",
    advanced_analytics: "التحليلات المتقدمة",
  };
  return labels[feature] ?? feature;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function calcDaysRemaining(endsAt: string | null): number {
  if (!endsAt) return 0;
  return Math.max(
    0,
    Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86_400_000),
  );
}
