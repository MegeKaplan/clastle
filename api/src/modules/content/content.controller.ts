import { FastifyRequest, FastifyReply } from "fastify";
import { ContentService } from "./content.service.js";
import { CreateContentRequest, GetContentsQuery, UpdateContentRequest } from "./content.dto.js";
import { validate } from "../../common/utils/validator.js";
import { AppError } from "../../common/errors/app-error.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class ContentController {
  constructor(private contentService: ContentService) { }

  async getContents(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as GetContentsQuery;

    const { success, errors } = validate(GetContentsQuery, query);

    if (!success) {
      throw new AppError(
        "Validation failed",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        errors
      )
    }

    const contents = await this.contentService.getContents(
      request.userAbility,
      query,
      query.includeDeleted === "true"
    );

    return reply.send(contents);
  }

  async getContent(request: FastifyRequest, reply: FastifyReply) {
    const { contentId } = request.params as { contentId: string };

    if (!contentId) {
      throw new AppError(
        "Content ID is required",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST
      )
    }

    const content = await this.contentService.getContent(request.userAbility, contentId);

    return reply.send(content);
  }

  async createContent(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body;

    const { success, errors } = validate(CreateContentRequest, body);

    if (!success) {
      throw new AppError(
        "Validation failed",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        errors
      )
    }

    const result = await this.contentService.createContent(request.userAbility, body);

    return reply.send({ message: 'Content created successfully', data: result });
  }

  async updateContent(request: FastifyRequest, reply: FastifyReply) {
    const { contentId } = request.params as { contentId: string };
    const body = request.body;

    if (!contentId) {
      throw new AppError(
        "Content ID is required",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST
      )
    }

    const { success, errors } = validate(UpdateContentRequest, body);

    if (!success) {
      throw new AppError(
        "Validation failed",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        errors
      )
    }

    const result = await this.contentService.updateContent(request.userAbility, contentId, body);

    return reply.send({ message: 'Content updated successfully', data: result });
  }

  async deleteContent(request: FastifyRequest, reply: FastifyReply) {
    const { contentId } = request.params as { contentId: string };
    const { hard } = request.query as { hard?: boolean | string };

    const hardDelete = hard === true || hard === 'true';

    if (!contentId) {
      throw new AppError(
        "Content ID is required",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST
      )
    }

    await this.contentService.deleteContent(request.userAbility, contentId, hardDelete);

    return reply.send({ message: 'Content deleted successfully' });
  }

}