// ─── API Error types ──────────────────────────────────────────────────────────
// Matches the backend error shape:
// { success, code, message, errors: [{ field, message }] }

export type ApiErrorResponse = {
  status?: number;
  data?: {
    success?: boolean;
    code?: string;
    message?: string;
    errors?: {
      field: string;
      message: string;
    }[];
  };
};

// ─── Error code → Arabic message map ─────────────────────────────────────────

const ERROR_CODE_MESSAGES: Record<string, string> = {
  // Auth
  INVALID_CREDENTIALS:        "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  EMAIL_ALREADY_EXISTS:       "البريد الإلكتروني مسجل بالفعل.",
  TOKEN_EXPIRED:              "انتهت صلاحية الجلسة. سجّل دخولك مرة أخرى.",

  // Subscription & Billing
  SUBSCRIPTION_REQUIRED:              "يلزم وجود اشتراك لاستخدام هذه الميزة.",
  SUBSCRIPTION_EXPIRED:               "انتهت فترة اشتراكك. اختر باقة للاستمرار.",
  INVALID_PLAN:                        "الباقة المطلوبة غير متاحة.",
  BILLING_CYCLE_NOT_AVAILABLE:         "دورة الدفع المطلوبة غير متاحة حاليًا.",
  PAYMENT_PROVIDER_ERROR:              "تعذر الاتصال بخدمة الدفع. حاول مرة أخرى.",
  BILLING_TRANSACTION_ALREADY_PROCESSED: "تمت معالجة عملية الدفع بالفعل.",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extracts a human-readable Arabic error message from an RTK Query error.
 * Checks error code map first, then falls back to the API message,
 * then to a generic fallback.
 */
export function getApiErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const apiError = error as ApiErrorResponse
    const code = apiError.data?.code
    if (code && ERROR_CODE_MESSAGES[code]) {
      return ERROR_CODE_MESSAGES[code]
    }
    return apiError.data?.message ?? 'حدث خطأ غير متوقع'
  }
  return 'حدث خطأ غير متوقع'
}

/**
 * Returns the first field-level validation error for a given field name,
 * or undefined if there is none. Useful for inline form field errors.
 */
export function getFieldError(error: unknown, field: string): string | undefined {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const apiError = error as ApiErrorResponse
    return apiError.data?.errors?.find((e) => e.field === field)?.message
  }
  return undefined
}
