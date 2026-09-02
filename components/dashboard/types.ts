export type PageKey =
  | 'dashboard'
  | 'students'
  | 'groups'
  | 'sessions'
  | 'attendance'
  | 'payments'
  | 'quizzes'
  | 'reports'
  | 'settings'

export type AttendanceStatus = 'حاضر' | 'غائب' | 'متأخر' | 'معذور'
export type PaymentStatus    = 'مدفوع' | 'غير مدفوع' | 'معلّق'

export interface StudentRow {
  name:       string
  attendance: AttendanceStatus
  payment:    PaymentStatus
}
