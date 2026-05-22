import { ZodError } from 'zod'

export function toBadRequest(error: unknown) {
  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join('; ')
    return createError({ statusCode: 400, statusMessage: message || 'Validation error' })
  }

  return error
}
