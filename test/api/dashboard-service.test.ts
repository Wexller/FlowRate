import { afterEach, describe, expect, it } from 'vitest'
import { rm } from 'node:fs/promises'
import path from 'node:path'
import { adjustCounter, getCurrentDashboardState, replaceDashboardCounters } from '../../server/domain/dashboard-service'

describe('dashboard service', () => {
  const dataDir = path.join(process.cwd(), 'data/test-jobflow')

  afterEach(async () => {
    process.env.JOBFLOW_DATA_DIR = dataDir
    await rm(dataDir, { recursive: true, force: true })
  })

  it('creates and returns default state', async () => {
    process.env.JOBFLOW_DATA_DIR = dataDir
    const state = await getCurrentDashboardState()
    expect(state.counters).toEqual({ applications: 0, replies: 0, interviews: 0, offers: 0 })
  })

  it('replaces counters and recalculates rates', async () => {
    process.env.JOBFLOW_DATA_DIR = dataDir
    const state = await replaceDashboardCounters({ counters: { applications: 100, replies: 30, interviews: 12, offers: 4 } })
    expect(state.conversions.replyRate).toBeCloseTo(0.3)
    expect(state.conversions.offerRate).toBeCloseTo(0.04)
  })

  it('increments selected counter', async () => {
    process.env.JOBFLOW_DATA_DIR = dataDir
    await replaceDashboardCounters({ counters: { applications: 2, replies: 1, interviews: 1, offers: 0 } })
    const next = await adjustCounter('offers', 1)
    expect(next.counters.offers).toBe(1)
  })

  it('does not allow decrement to invalid order', async () => {
    process.env.JOBFLOW_DATA_DIR = dataDir
    await replaceDashboardCounters({ counters: { applications: 3, replies: 1, interviews: 1, offers: 1 } })
    await expect(adjustCounter('replies', -1)).rejects.toBeTruthy()
  })
})
