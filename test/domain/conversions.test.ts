import { describe, expect, it } from 'vitest'
import { calculateConversions } from '../../server/domain/conversions'
import { dashboardCountersSchema } from '../../shared/schemas/dashboard'
import { getAggregateKey } from '../../server/domain/aggregates'

describe('conversion logic', () => {
  it('calculates rates from applications', () => {
    const result = calculateConversions({ applications: 50, replies: 12, interviews: 6, offers: 2 })
    expect(result.replyRate).toBeCloseTo(0.24)
    expect(result.interviewRate).toBeCloseTo(0.12)
    expect(result.offerRate).toBeCloseTo(0.04)
  })

  it('returns zeros when base is zero', () => {
    expect(calculateConversions({ applications: 0, replies: 0, interviews: 0, offers: 0 })).toEqual({
      replyRate: 0,
      interviewRate: 0,
      offerRate: 0
    })
  })

  it('rejects broken ordering rule', () => {
    expect(() => dashboardCountersSchema.parse({ applications: 10, replies: 12, interviews: 1, offers: 0 })).toThrow()
  })

  it('rejects negative values', () => {
    expect(() => dashboardCountersSchema.parse({ applications: -1, replies: 0, interviews: 0, offers: 0 })).toThrow()
  })

  it('builds daily/weekly/monthly aggregate keys', () => {
    const iso = '2026-05-21T10:00:00.000Z'
    expect(getAggregateKey('daily', iso)).toBe('2026-05-21')
    expect(getAggregateKey('weekly', iso)).toBe('2026-W21')
    expect(getAggregateKey('monthly', iso)).toBe('2026-05')
  })
})
