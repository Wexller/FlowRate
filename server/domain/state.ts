import { DEFAULT_COUNTERS } from '../../shared/constants/dashboard'
import { calculateConversions } from './conversions'
import { dashboardCountersSchema, dashboardStateSchema, type DashboardCounters, type DashboardState } from '../../shared/schemas/dashboard'

export function normalizeState(counters: DashboardCounters): DashboardState {
  const validated = dashboardCountersSchema.parse(counters)
  const state: DashboardState = {
    updatedAt: new Date().toISOString(),
    counters: validated,
    conversions: calculateConversions(validated)
  }

  return dashboardStateSchema.parse(state)
}

export function makeInitialState(): DashboardState {
  return normalizeState({ ...DEFAULT_COUNTERS })
}

export function parseState(input: unknown): DashboardState {
  return dashboardStateSchema.parse(input)
}
