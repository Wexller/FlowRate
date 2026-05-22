import { z } from 'zod'
import { AGGREGATE_PERIODS, COUNTER_KEYS } from '../constants/dashboard'

const int = z.number().int().nonnegative()

export const dashboardCountersSchema = z
  .object({
    applications: int,
    replies: int,
    interviews: int,
    offers: int
  })
  .superRefine((value, ctx) => {
    if (value.applications < value.replies) {
      ctx.addIssue({ code: 'custom', message: 'applications must be >= replies', path: ['replies'] })
    }
    if (value.replies < value.interviews) {
      ctx.addIssue({ code: 'custom', message: 'replies must be >= interviews', path: ['interviews'] })
    }
    if (value.interviews < value.offers) {
      ctx.addIssue({ code: 'custom', message: 'interviews must be >= offers', path: ['offers'] })
    }
  })

export const dashboardConversionsSchema = z.object({
  replyRate: z.number().min(0).max(1),
  interviewRate: z.number().min(0).max(1),
  offerRate: z.number().min(0).max(1)
})

export const dashboardStateSchema = z.object({
  updatedAt: z.string().datetime(),
  counters: dashboardCountersSchema,
  conversions: dashboardConversionsSchema
})

export const dashboardAggregatePointSchema = z.object({
  period: z.enum(AGGREGATE_PERIODS),
  key: z.string(),
  updatedAt: z.string().datetime(),
  counters: dashboardCountersSchema,
  conversions: dashboardConversionsSchema
})

export const dashboardPutPayloadSchema = z.object({
  counters: dashboardCountersSchema
})

export const aggregateQuerySchema = z.object({
  period: z.enum(AGGREGATE_PERIODS),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})

export const counterKeySchema = z.enum(COUNTER_KEYS)

export type DashboardCounters = z.infer<typeof dashboardCountersSchema>
export type DashboardConversions = z.infer<typeof dashboardConversionsSchema>
export type DashboardState = z.infer<typeof dashboardStateSchema>
export type DashboardAggregatePoint = z.infer<typeof dashboardAggregatePointSchema>
export type DashboardCounterKey = z.infer<typeof counterKeySchema>
export type AggregatePeriod = z.infer<typeof aggregateQuerySchema.shape.period>
