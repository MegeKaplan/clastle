import { z } from 'zod'

export const AuthUser = z.object({
  email: z.email(),
  passwordHash: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})

export type AuthUser = z.infer<typeof AuthUser>