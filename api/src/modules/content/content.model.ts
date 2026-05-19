import { z } from 'zod'

export const Content = z.object({
  title: z.string().optional(),
  body: z.string(),
  type: z.enum(["POST", "ANNOUNCEMENT"]),
  authorId: z.string(),
  clubId: z.string().optional(),
  expiresAt: z.date().optional(),
  visibility: z.enum(['PUBLIC', 'CLUB_ONLY', 'PRIVATE']).default('PUBLIC'),
})

export type Content = z.infer<typeof Content>