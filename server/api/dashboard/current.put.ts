import { replaceDashboardCounters } from '../../domain/dashboard-service'
import { toBadRequest } from '../../domain/errors'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    return await replaceDashboardCounters(body)
  } catch (error) {
    throw toBadRequest(error)
  }
})
