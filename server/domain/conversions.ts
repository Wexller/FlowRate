import type { DashboardConversions, DashboardCounters } from '../../shared/schemas/dashboard'

export function calculateConversions(counters: DashboardCounters): DashboardConversions {
  const base = counters.applications
  if (base === 0) {
    return { replyRate: 0, interviewRate: 0, offerRate: 0 }
  }

  return {
    replyRate: counters.replies / base,
    interviewRate: counters.interviews / base,
    offerRate: counters.offers / base
  }
}
