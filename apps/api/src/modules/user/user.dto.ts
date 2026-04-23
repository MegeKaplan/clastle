import { z } from 'zod';

export const GetUsersQuery = z.object({
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]),

  page: z.string().regex(/^\d+$/),
  limit: z.string().regex(/^\d+$/),
  sortBy: z.enum(["createdAt", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
}).partial();

export type GetUsersQuery = z.infer<typeof GetUsersQuery>;