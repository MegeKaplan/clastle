import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "./user.service.js";
import { GetUsersQuery } from "./user.dto.js";
import { validate } from "../../common/utils/validator.js";
import { AppError } from "../../common/errors/app-error.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class UserController {
  constructor(private userService: UserService) { }

  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as GetUsersQuery;

    const { success, errors } = validate(GetUsersQuery, query);

    if (!success) {
      throw new AppError(
        "Validation failed",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        errors
      )
    }

    const users = await this.userService.getUsers(
      request.userAbility,
      query
    );

    return reply.send(users);
  }
}