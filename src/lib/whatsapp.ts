// ─── Egyptian phone normalization ─────────────────────────────────────────────

/**
 * Normalizes an Egyptian phone number to the international format
 * WhatsApp expects (without the "+" prefix).
 *
 *   "01012345678"  → "201012345678"
 *   "201012345678" → "201012345678"
 *   "00201012345678" → "201012345678"
 */
export function normalizeEgyptPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("01")) {
    return `2${cleaned}`;
  }

  if (cleaned.startsWith("201")) {
    return cleaned;
  }

  // Strip leading 00 (international prefix)
  if (cleaned.startsWith("00201")) {
    return cleaned.slice(2);
  }

  return cleaned;
}

// ─── Parent report message builder ────────────────────────────────────────────

export type ParentReport = {
  student: {
    name: string;
    grade?: string;
  };
  attendance: {
    total: number;
    present: number;
    late: number;
    absent: number;
    rate: number;
  };
  payments: {
    expected: number;
    paid: number;
    outstanding: number;
  };
  groups: { name: string; subject?: string }[];
  quizzes: {
    count: number;
    average: number;
    latest: { title: string; score: number; total: number }[];
  };
};

/**
 * Builds a formatted Arabic WhatsApp message from the parent report data.
 */
export function buildParentReportMessage(report: ParentReport): string {
  const lines: string[] = [];

  lines.push("السلام عليكم،");
  lines.push("");
  lines.push(`تقرير الطالب ${report.student.name} على مَدار:`);

  // ── Groups ──
  lines.push("");
  if (report.groups.length === 1) {
    lines.push("📚 المجموعة:");
  } else {
    lines.push("📚 المجموعات:");
  }
  report.groups.forEach((g) => {
    lines.push(g.subject ? `${g.name} - ${g.subject}` : g.name);
  });

  // ── Attendance ──
  lines.push("");
  lines.push("📅 الحضور:");
  lines.push(`إجمالي الحصص: ${report.attendance.total}`);
  lines.push(`حاضر: ${report.attendance.present}`);
  lines.push(`متأخر: ${report.attendance.late}`);
  lines.push(`غائب: ${report.attendance.absent}`);
  const rate =
    report.attendance.rate % 1 === 0
      ? report.attendance.rate
      : report.attendance.rate.toFixed(1);
  lines.push(`نسبة الحضور: ${rate}%`);

  // ── Quizzes ──
  lines.push("");
  lines.push("📝 الاختبارات:");
  lines.push(`عدد الاختبارات: ${report.quizzes.count}`);
  const avg =
    report.quizzes.average % 1 === 0
      ? report.quizzes.average
      : report.quizzes.average.toFixed(1);
  lines.push(`متوسط الدرجات: ${avg}%`);

  if (report.quizzes.latest.length > 0) {
    const latest = report.quizzes.latest[0];
    lines.push("");
    lines.push("آخر اختبار:");
    lines.push(latest.title);
    lines.push(`${latest.score} / ${latest.total}`);
  }

  // ── Payments ──
  lines.push("");
  lines.push("💳 المدفوعات:");
  lines.push(`المطلوب: ${report.payments.expected} جنيه`);
  lines.push(`المدفوع: ${report.payments.paid} جنيه`);
  lines.push(`المتبقي: ${report.payments.outstanding} جنيه`);

  lines.push("");
  lines.push("مع تحيات الأستاذ.");

  return lines.join("\n");
}
