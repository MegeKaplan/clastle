import { PrismaClient } from '../../generated/prisma/client.js';
import { AuthUser } from './auth.model.js';

export class AuthRepository {
  constructor(private db: PrismaClient) { }

  async findByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  async create(data: AuthUser) {
    return this.db.user.create({ data });
  }
}