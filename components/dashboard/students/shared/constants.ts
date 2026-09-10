import type { Student } from '@/src/lib/api/studentsApi'

// Re-export from the canonical location so every consumer uses the same helper
export { getApiErrorMessage } from '@/src/lib/api/error'

export const SCHOOL_TYPE_LABELS: Record<NonNullable<Student['schoolType']>, string> = {
  government:   'حكومي',
  experimental: 'تجريبي',
  private:      'خاص',
  other:        'أخرى',
}
