import type { DashboardState } from '../schemas/dashboard'

export const STATS_POST_LOCALES = ['ru', 'en'] as const

export type StatsPostLocale = (typeof STATS_POST_LOCALES)[number]

export const STATS_POST_TOKENS = [
  'updatedAt',
  'applications',
  'replies',
  'interviews',
  'offers',
  'replyRatePercent',
  'interviewRatePercent',
  'offerRatePercent'
] as const

export type StatsPostToken = (typeof STATS_POST_TOKENS)[number]
export type StatsPostTemplateContext = Record<StatsPostToken, string>

const LOCALE_CODES: Record<StatsPostLocale, string> = {
  ru: 'ru-RU',
  en: 'en-US'
}

const TEMPLATE_TOKEN_PATTERN = /{{\s*([a-zA-Z][a-zA-Z0-9]*)\s*}}/g

export function formatStatsPostInteger(value: number, locale: StatsPostLocale): string {
  return new Intl.NumberFormat(LOCALE_CODES[locale], {
    maximumFractionDigits: 0
  }).format(value)
}

export function formatStatsPostPercent(value: number, locale: StatsPostLocale): string {
  return new Intl.NumberFormat(LOCALE_CODES[locale], {
    style: 'percent',
    maximumFractionDigits: 0
  })
    .format(value)
    .replace(/\u00a0/g, ' ')
}

export function formatStatsPostUpdatedAt(updatedAt: string, locale: StatsPostLocale): string {
  const formatter = new Intl.DateTimeFormat(LOCALE_CODES[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  })

  return `${formatter.format(new Date(updatedAt))} UTC`
}

export function buildStatsPostContext(state: DashboardState, locale: StatsPostLocale): StatsPostTemplateContext {
  return {
    updatedAt: formatStatsPostUpdatedAt(state.updatedAt, locale),
    applications: formatStatsPostInteger(state.counters.applications, locale),
    replies: formatStatsPostInteger(state.counters.replies, locale),
    interviews: formatStatsPostInteger(state.counters.interviews, locale),
    offers: formatStatsPostInteger(state.counters.offers, locale),
    replyRatePercent: formatStatsPostPercent(state.conversions.replyRate, locale),
    interviewRatePercent: formatStatsPostPercent(state.conversions.interviewRate, locale),
    offerRatePercent: formatStatsPostPercent(state.conversions.offerRate, locale)
  }
}

export function renderStatsPostTemplate(template: string, context: StatsPostTemplateContext): string {
  return template.replace(TEMPLATE_TOKEN_PATTERN, (_match, token: string) => {
    if (!Object.hasOwn(context, token)) {
      throw new Error(`Missing template value for token "${token}"`)
    }

    return context[token as StatsPostToken]
  })
}
