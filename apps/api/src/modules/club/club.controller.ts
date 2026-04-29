import { FastifyRequest, FastifyReply } from "fastify";
import { validate } from "../../common/utils/validator.js";
import { AppError } from "../../common/errors/app-error.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ClubService } from "./club.service.js";
import { GetClubsQuery } from "./club.dto.js";

export class ClubController {
  constructor(private clubService: ClubService) { }

  async getClubs(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as GetClubsQuery;

    const { success, errors } = validate(GetClubsQuery, query);

    if (!success) {
      throw new AppError(
        "Validation failed",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        errors
      )
    }

    const clubs = await this.clubService.getClubs(
      request.userAbility,
      query
    );

    return reply.send(clubs);
  }

  async joinClub(request: FastifyRequest, reply: FastifyReply) {
    const { clubId } = request.params as { clubId: string };
    const userId = request.user?.id;

    if (!clubId) {
      throw new AppError(
        "Club ID is required",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST
      )
    }

    if (!userId) {
      throw new AppError(
        "Authentication required",
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED
      )
    }

    const result = await this.clubService.joinClub(
      request.userAbility,
      clubId,
      userId
    );

    return reply.send(result);
  }

  async leaveClub(request: FastifyRequest, reply: FastifyReply) {
    const { clubId } = request.params as { clubId: string };
    const userId = request.user?.id;

    if (!clubId) {
      throw new AppError(
        "Club ID is required",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST
      )
    }

    if (!userId) {
      throw new AppError(
        "Authentication required",
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED
      )
    }

    const result = await this.clubService.leaveClub(
      request.userAbility,
      clubId,
      userId
    );

    return reply.send(result);
  }
}