import type { Group } from '@/src/lib/api/groupsApi'

export { getApiErrorMessage } from '@/src/lib/api/error'
export { SCHOOL_TYPE_LABELS }  from '@/src/constants/schoolTypes'

export const BILLING_MODEL_LABELS: Record<Group['billingModel'], string> = {
  per_session: 'لكل حصة',
  monthly:     'شهري',
}
