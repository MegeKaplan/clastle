import { Role } from '../../generated/prisma/enums.js';

export type AccessTokenPayload = {
  userId: string;
  email: string;
  role: Role;
}