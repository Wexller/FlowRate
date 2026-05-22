import { adjustCounter } from '../../../../domain/dashboard-service'
import { toBadRequest } from '../../../../domain/errors'

export default defineEventHandler(async (event) => {
  try {
    const counterKey = getRouterParam(event, 'counterKey') || ''
    return await adjustCounter(counterKey, 1)
  } catch (error) {
    throw toBadRequest(error)
  }
})
