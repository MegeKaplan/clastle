import { z } from 'zod'

export const RegisterRequest = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
})

// export const RegisterResponse = z.object({
//   user: z.object({
//     id: z.uuidv7(),
//     email: z.email(),
//     firstName: z.string(),
//     lastName: z.string(),
//     createdAt: z.date()
//   })
// })

export type RegisterRequest = z.infer<typeof RegisterRequest>
// export type RegisterResponse = z.infer<typeof RegisterResponse>

export const LoginRequest = z.object({
  email: z.email(),
  password: z.string(),
})

export type LoginRequest = z.infer<typeof LoginRequest>