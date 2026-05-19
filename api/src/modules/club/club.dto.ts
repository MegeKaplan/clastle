import { z } from 'zod';

export const GetClubsQuery = z.object({
  page: z.string().regex(/^\d+$/),
  limit: z.string().regex(/^\d+$/),
  sortBy: z.enum(["createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
}).partial();

export type GetClubsQuery = z.infer<typeof GetClubsQuery>;