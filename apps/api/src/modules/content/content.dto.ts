import { z } from 'zod';

// GetContents
export const GetContentsQuery = z.object({
  body: z.string(),
  authorId: z.string(),
  type: z.enum(["POST", "ANNOUNCEMENT"]),

  page: z.string().regex(/^\d+$/),
  limit: z.string().regex(/^\d+$/),
  sortBy: z.enum(["createdAt", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  includeDeleted: z.enum(["true", "false"]).default("false"),
}).partial();

export type GetContentsQuery = z.infer<typeof GetContentsQuery>;

// CreateContent
export const CreateContentRequest = z.object({
  title: z.string().optional(),
  body: z.string(),
  type: z.enum(["POST", "ANNOUNCEMENT"]),
  authorId: z.string(),
  clubId: z.string().optional(),
  expiresAt: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'CLUB_ONLY', 'PRIVATE']).default('PUBLIC'),
});

export type CreateContentRequest = z.infer<typeof CreateContentRequest>;

// UpdateContent
export const UpdateContentRequest = CreateContentRequest.partial();

export type UpdateContentRequest = z.infer<typeof UpdateContentRequest>;