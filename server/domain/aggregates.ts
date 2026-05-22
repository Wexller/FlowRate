import type { AggregatePeriod, DashboardState } from '../../shared/schemas/dashboard'

export function getAggregateKey(period: AggregatePeriod, dateIso: string): string {
  const date = new Date(dateIso)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  if (period === 'daily') {
    return `${year}-${month}-${day}`
  }

  if (period === 'monthly') {
    return `${year}-${month}`
  }

  const week = getIsoWeek(date)
  return `${year}-W${String(week).padStart(2, '0')}`
}

function getIsoWeek(date: Date): number {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1))
  return Math.ceil((((utc.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export function withinRange(key: string, from: string, to: string): boolean {
  return key >= from && key <= to
}

export function toAggregatePoint(period: AggregatePeriod, key: string, state: DashboardState) {
  return {
    period,
    key,
    updatedAt: state.updatedAt,
    counters: state.counters,
    conversions: state.conversions
  }
}
