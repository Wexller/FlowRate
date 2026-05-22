import { aggregateQuerySchema } from '../../../shared/schemas/dashboard'
import { getAggregates } from '../../domain/dashboard-service'
import { toBadRequest } from '../../domain/errors'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const parsed = aggregateQuerySchema.parse(query)
    return await getAggregates(parsed)
  } catch (error) {
    throw toBadRequest(error)
  }
})
