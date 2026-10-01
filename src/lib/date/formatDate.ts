// ─── Arabic date formatter ────────────────────────────────────────────────────

export const formatArabicDate = (value: string): string =>
  new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  }).format(new Date(value))

// Short version — e.g. "١٥ أكتوبر ٢٠٢٦"
export const formatArabicDateShort = (value: string): string =>
  new Intl.DateTimeFormat('ar-EG', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  }).format(new Date(value))
