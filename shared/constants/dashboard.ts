export const COUNTER_KEYS = [
  'applications',
  'replies',
  'interviews',
  'offers'
] as const

export const AGGREGATE_PERIODS = ['daily', 'weekly', 'monthly'] as const

export const DEFAULT_COUNTERS = {
  applications: 0,
  replies: 0,
  interviews: 0,
  offers: 0
} as const

export const DEFAULT_DATA_DIR = 'data/jobflow'
