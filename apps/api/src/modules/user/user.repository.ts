import { PrismaClient } from '../../generated/prisma/client.js';

export class UserRepository {
  constructor(private prisma: PrismaClient) { }

  async getUsers(args: any, includeDeleted: boolean = false) {
    return this.prisma.user.findMany({
      ...args,
      where: {
        ...args.where,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });
  }

  async findUserById(userId: string, includeDeleted: boolean = false) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      }
    });
  }

  async findUserByEmail(email: string, includeDeleted: boolean = false) {
    return this.prisma.user.findFirst({
      where: {
        email,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });
  }

  async createUser(data: any) {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUserById(userId: string, data: any, includeDeleted: boolean = false) {
    return this.prisma.user.update({
      where: {
        id: userId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      data,
    });
  }

  async deleteUserById(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}