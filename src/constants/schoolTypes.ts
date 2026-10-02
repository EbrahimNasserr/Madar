export type SchoolType = 'government' | 'experimental' | 'private' | 'other'

export const SCHOOL_TYPE_LABELS: Record<SchoolType, string> = {
  government:   'حكومي',
  experimental: 'تجريبي',
  private:      'خاص',
  other:        'أخرى',
}
