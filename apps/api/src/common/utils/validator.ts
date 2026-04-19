import { z } from "zod"

export const validateBody = (schema: z.ZodType, body: unknown) => {
  const result = schema.safeParse(body)

  if (result.success) {
    return {
      success: true,
      data: result.data
    }
  }

  return {
    success: false,
    errors: result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message
    }))
  }
}