import { accessibleBy } from '@casl/prisma';
import { AppAbility } from '../../common/casl/defineAbility.js';
import { ContentRepository } from './content.repository.js';
import { AppError } from '../../common/errors/app-error.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Content } from './content.model.js';

export class ContentService {
  constructor(private contentRepository: ContentRepository) { }

  async getContents(ability: AppAbility, query: any, includeDeleted: boolean = false) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    const where = {
      ...accessibleBy(ability).Content,
      type: query.type,
      authorId: query.authorId,
      clubId: query.clubId,
    };

    const contents = await this.contentRepository.getContents({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: query.sortBy
        ? { [query.sortBy]: query.sortOrder }
        : undefined,
    }, includeDeleted)

    return contents
  }

  async getContent(ability: AppAbility, contentId: string) {
    const canRead = ability.can("read", "Content");

    if (!canRead) {
      throw new AppError(
        "You do not have permission to read content",
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN
      );
    }

    const content = await this.contentRepository.findContentById(contentId);

    if (!content) {
      throw new AppError(
        "Content not found",
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }

    return content;
  }

  async createContent(ability: AppAbility, data: any) {
    const canCreate = ability.can("create", "Content");

    if (!canCreate) {
      throw new AppError(
        "You do not have permission to create content",
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN
      );
    }

    const contentData: Content = {
      title: data.title,
      body: data.body,
      type: data.type,
      authorId: data.authorId,
      clubId: data.clubId,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      visibility: data.visibilitys || 'PUBLIC',
    };

    const result = await this.contentRepository.createContent(contentData);

    return result;
  }

  async updateContent(ability: AppAbility, contentId: string, updateData: any) {
    const canUpdate = ability.can("update", "Content");

    if (!canUpdate) {
      throw new AppError(
        "You do not have permission to update content",
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN
      );
    }

    const content = await this.contentRepository.findContentById(contentId);

    if (!content) {
      throw new AppError(
        "Content not found",
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }

    const result = await this.contentRepository.updateContentById(
      contentId,
      {
        ...updateData,
        expiresAt: updateData.expiresAt ? new Date(updateData.expiresAt) : updateData.expiresAt,
      }
    );

    return result;
  }

  async deleteContent(ability: AppAbility, contentId: string, hardDelete: boolean = false) {
    const canDelete = ability.can("delete", "Content");

    if (!canDelete) {
      throw new AppError(
        "You do not have permission to delete content",
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN
      );
    }

    const content = await this.contentRepository.findContentById(contentId);

    if (!content) {
      throw new AppError(
        "Content not found",
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }

    if (hardDelete) {
      await this.contentRepository.deleteContentById(contentId);
    } else {
      await this.contentRepository.updateContentById(contentId, { deletedAt: new Date() });
    }

    return;
  }

}