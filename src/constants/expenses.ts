import type { ExpenseCategory } from "@/src/lib/api/expensesApi";

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "rent",           label: "إيجار"     },
  { value: "printing",       label: "طباعة"     },
  { value: "transportation", label: "مواصلات"   },
  { value: "supplies",       label: "مستلزمات"  },
  { value: "advertising",    label: "إعلانات"   },
  { value: "assistant",      label: "مساعدين"   },
  { value: "internet",       label: "إنترنت"    },
  { value: "other",          label: "أخرى"      },
];

export function getExpenseCategoryLabel(category: ExpenseCategory): string {
  return EXPENSE_CATEGORIES.find((item) => item.value === category)?.label ?? category;
}
