import { getCurrentDashboardState } from '../../domain/dashboard-service'

export default defineEventHandler(async () => {
  return getCurrentDashboardState()
})
