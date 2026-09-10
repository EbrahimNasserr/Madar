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

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Extracts a human-readable Arabic error message from an RTK Query error.
 * Falls back to a generic message when the shape is unexpected.
 */
export function getApiErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const apiError = error as ApiErrorResponse
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
