import { z } from 'zod'

export const User = z.object({
  email: z.email(),
  passwordHash: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["SUPERADMIN", "ADMIN", "USER"]),
  onboardingCompleted: z.boolean().default(false),
})

export type User = z.infer<typeof User>