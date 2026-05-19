import { PrismaClient } from '../../generated/prisma/client.js';

export class ContentRepository {
  constructor(private prisma: PrismaClient) { }

  async getContents(args: any, includeDeleted: boolean = false) {
    return this.prisma.content.findMany({
      ...args,
      where: {
        ...args.where,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });
  }

  async findContentById(contentId: string, includeDeleted: boolean = false) {
    return this.prisma.content.findFirst({
      where: {
        id: contentId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      }
    });
  }

  async createContent(data: any) {
    return this.prisma.content.create({
      data,
    });
  }

  async updateContentById(contentId: string, data: any, includeDeleted: boolean = false) {
    return this.prisma.content.update({
      where: {
        id: contentId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      data,
    });
  }

  async deleteContentById(contentId: string) {
    return this.prisma.content.delete({
      where: { id: contentId },
    });
  }
}