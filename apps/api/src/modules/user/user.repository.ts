import { PrismaClient } from '../../generated/prisma/client.js';

export class UserRepository {
  constructor(private prisma: PrismaClient) { }

  async getUsers(args: any) {
    return this.prisma.user.findMany(args);
  }

  async findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateUserById(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });

  }
}