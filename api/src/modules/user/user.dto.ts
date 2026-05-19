import { z } from 'zod';

// GetUsers
export const GetUsersQuery = z.object({
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]),

  page: z.string().regex(/^\d+$/),
  limit: z.string().regex(/^\d+$/),
  sortBy: z.enum(["createdAt", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  includeDeleted: z.enum(["true", "false"]).default("false"),
}).partial();

export type GetUsersQuery = z.infer<typeof GetUsersQuery>;

// CreateUser
export const CreateUserRequest = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequest>;

// UpdateUser
export const UpdateUserRequest = CreateUserRequest.partial();

export type UpdateUserRequest = z.infer<typeof UpdateUserRequest>;