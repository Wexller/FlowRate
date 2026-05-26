import { describe, expect, it } from 'vitest'
import { buildStatsPostContext, formatStatsPostPercent, formatStatsPostUpdatedAt, renderStatsPostTemplate } from '../../shared/utils/stats-post'
import type { DashboardState } from '../../shared/schemas/dashboard'

const fixtureState: DashboardState = {
  updatedAt: '2026-05-22T09:25:32.788Z',
  counters: {
    applications: 50,
    replies: 12,
    interviews: 6,
    offers: 2
  },
  conversions: {
    replyRate: 0.24,
    interviewRate: 0.12,
    offerRate: 0.04
  }
}

describe('stats post rendering', () => {
  it('renders known tokens into markdown text', () => {
    const context = buildStatsPostContext(fixtureState, 'en')
    const rendered = renderStatsPostTemplate(
      'Updated: {{updatedAt}}\nApplications: {{applications}}\nReply rate: {{replyRatePercent}}',
      context
    )

    expect(rendered).not.toContain('{{')
    expect(rendered).toContain('Applications: 50')
    expect(rendered).toContain('Reply rate: 24%')
  })

  it('fails with a useful error when a token is missing', () => {
    const context = buildStatsPostContext(fixtureState, 'en')
    expect(() => renderStatsPostTemplate('Missing: {{unknownToken}}', context)).toThrow(
      'Missing template value for token "unknownToken"'
    )
  })

  it('formats timestamps for both supported locales', () => {
    expect(formatStatsPostUpdatedAt(fixtureState.updatedAt, 'en')).toBe('May 22, 2026 at 09:25 UTC')
    expect(formatStatsPostUpdatedAt(fixtureState.updatedAt, 'ru')).toBe('22 мая 2026 г. в 09:25 UTC')
  })

  it('formats percentages for both supported locales, including zero state', () => {
    expect(formatStatsPostPercent(0.24, 'en')).toBe('24%')
    expect(formatStatsPostPercent(0.24, 'ru')).toBe('24 %')
    expect(formatStatsPostPercent(0, 'en')).toBe('0%')
    expect(formatStatsPostPercent(0, 'ru')).toBe('0 %')
  })
})
