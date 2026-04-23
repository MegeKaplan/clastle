import { z } from "zod"

export const validate = (schema: z.ZodType, input: unknown) => {
  const result = schema.safeParse(input);

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