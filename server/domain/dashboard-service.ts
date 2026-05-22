import { counterKeySchema, dashboardPutPayloadSchema, type DashboardCounterKey, type DashboardState } from '../../shared/schemas/dashboard'
import { getAggregateKey } from './aggregates'
import { normalizeState } from './state'
import { readAggregates, readCurrentState, writeCurrentState } from '../utils/storage'

export async function getCurrentDashboardState(): Promise<DashboardState> {
  return readCurrentState()
}

export async function replaceDashboardCounters(payload: unknown): Promise<DashboardState> {
  const parsed = dashboardPutPayloadSchema.parse(payload)
  const next = normalizeState(parsed.counters)
  return writeCurrentState(next)
}

export async function adjustCounter(counterKey: string, delta: 1 | -1): Promise<DashboardState> {
  const key: DashboardCounterKey = counterKeySchema.parse(counterKey)
  const current = await readCurrentState()
  const counters = { ...current.counters, [key]: current.counters[key] + delta }
  const next = normalizeState(counters)
  return writeCurrentState(next)
}

export async function getAggregates(query: { period: 'daily' | 'weekly' | 'monthly'; from: string; to: string }) {
  const fromKey = getAggregateKey(query.period, `${query.from}T00:00:00.000Z`)
  const toKey = getAggregateKey(query.period, `${query.to}T23:59:59.999Z`)
  return readAggregates(query.period, fromKey, toKey)
}
