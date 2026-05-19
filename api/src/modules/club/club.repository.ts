import { PrismaClient } from '../../generated/prisma/client.js';

export class ClubRepository {
  constructor(private prisma: PrismaClient) { }

  async getClubs(args: any) {
    return this.prisma.club.findMany(args);
  }

  async findMembership(clubId: string, userId: string) {
    return this.prisma.membership.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId,
        }
      }
    });
  }

  async createMembership(clubId: string, userId: string) {
    return this.prisma.membership.create({
      data: {
        userId,
        clubId,
      }
    });
  }

  async deleteMembership(clubId: string, userId: string) {
    return this.prisma.membership.delete({
      where: {
        userId_clubId: {
          userId,
          clubId,
        }
      }
    });
  }
}