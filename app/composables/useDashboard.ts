import type { DashboardState } from '~~/shared/schemas/dashboard'

export function useDashboard() {
  const state = useState<DashboardState | null>('dashboard-state', () => null)
  const pending = useState<boolean>('dashboard-pending', () => false)

  async function refresh() {
    pending.value = true
    try {
      state.value = await $fetch<DashboardState>('/api/dashboard/current')
    } finally {
      pending.value = false
    }
  }

  async function updateCounters(counters: DashboardState['counters']) {
    pending.value = true
    try {
      state.value = await $fetch<DashboardState>('/api/dashboard/current', {
        method: 'PUT',
        body: { counters }
      })
    } finally {
      pending.value = false
    }
  }

  async function increment(counterKey: keyof DashboardState['counters']) {
    pending.value = true
    try {
      state.value = await $fetch<DashboardState>(`/api/dashboard/counters/${counterKey}/increment`, { method: 'POST' })
    } finally {
      pending.value = false
    }
  }

  async function decrement(counterKey: keyof DashboardState['counters']) {
    pending.value = true
    try {
      state.value = await $fetch<DashboardState>(`/api/dashboard/counters/${counterKey}/decrement`, { method: 'POST' })
    } finally {
      pending.value = false
    }
  }

  return { state, pending, refresh, updateCounters, increment, decrement }
}
