import type { Group } from '@/src/lib/api/groupsApi'

export { getApiErrorMessage } from '@/src/lib/api/error'

export const SCHOOL_TYPE_LABELS: Record<NonNullable<Group['schoolType']>, string> = {
  government:   'حكومي',
  experimental: 'تجريبي',
  private:      'خاص',
  other:        'أخرى',
}

export const BILLING_MODEL_LABELS: Record<Group['billingModel'], string> = {
  per_session: 'لكل حصة',
  monthly:     'شهري',
}
