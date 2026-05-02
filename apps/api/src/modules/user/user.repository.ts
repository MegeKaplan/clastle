import { PrismaClient } from '../../generated/prisma/client.js';

type UserQueryArgs = any;

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  private mapUser(user: any) {
    if (!user) return user;

    const { memberships, ...rest } = user;

    return {
      ...rest,
      clubs: memberships?.map((m: any) => m.club) ?? [],
    };
  }

  private mapUsers(users: any[]) {
    return users.map((u) => this.mapUser(u));
  }

  async getUsers(args: UserQueryArgs, includeDeleted: boolean = false) {
    const users = await this.prisma.user.findMany({
      ...args,
      include: {
        memberships: {
          include: {
            club: true,
          },
        },
        ...(args?.include ?? {}),
      },
      where: {
        ...args?.where,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });

    return this.mapUsers(users);
  }

  async findUserById(userId: string, includeDeleted: boolean = false) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      include: {
        memberships: {
          include: {
            club: true,
          },
        },
      },
    });

    return this.mapUser(user);
  }

  async findUserByEmail(email: string, includeDeleted: boolean = false) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      include: {
        memberships: {
          include: {
            club: true,
          },
        },
      },
    });

    return this.mapUser(user);
  }

  async createUser(data: any) {
    const user = await this.prisma.user.create({
      data,
    });

    return this.mapUser(user);
  }

  async updateUserById(userId: string, data: any, includeDeleted: boolean = false) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      data,
      include: {
        memberships: {
          include: {
            club: true,
          },
        },
      },
    });

    return this.mapUser(user);
  }

  async deleteUserById(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}