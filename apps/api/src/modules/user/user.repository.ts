import { PrismaClient } from '../../generated/prisma/client.js';

export class UserRepository {
  constructor(private prisma: PrismaClient) { }

  async getUsers(args: any) {
    return this.prisma.user.findMany(args);
  }
}