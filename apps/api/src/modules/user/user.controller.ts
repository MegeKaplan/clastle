import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "./user.service.js";
import { CreateUserRequest, GetUsersQuery, UpdateUserRequest } from "./user.dto.js";
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
      query,
      query.includeDeleted === "true"
    );

    return reply.send(users);
  }

  async approveUser(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };

    if (!userId) {
      throw new AppError(
        "User ID is required",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST
      )
    }

    await this.userService.approveUser(request.userAbility, userId);

    return reply.send({ message: 'User approved successfully' });
  }

  async rejectUser(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };

    if (!userId) {
      throw new AppError(
        "User ID is required",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST
      )
    }

    await this.userService.rejectUser(request.userAbility, userId);

    return reply.send({ message: 'User rejected successfully' });
  }

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body;

    const { success, errors } = validate(CreateUserRequest, body);

    if (!success) {
      throw new AppError(
        "Validation failed",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        errors
      )
    }

    const result = await this.userService.createUser(request.userAbility, body);

    return reply.send({ message: 'User created successfully', data: result });
  }

  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };
    const body = request.body;

    if (!userId) {
      throw new AppError(
        "User ID is required",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST
      )
    }

    const { success, errors } = validate(UpdateUserRequest, body);

    if (!success) {
      throw new AppError(
        "Validation failed",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        errors
      )
    }

    const result = await this.userService.updateUser(request.userAbility, userId, body);

    return reply.send({ message: 'User updated successfully', data: result });
  }

  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };
    const { hard } = request.query as { hard?: boolean | string };

    const hardDelete = hard === true || hard === 'true';

    if (!userId) {
      throw new AppError(
        "User ID is required",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST
      )
    }

    await this.userService.deleteUser(request.userAbility, userId, hardDelete);

    return reply.send({ message: 'User deleted successfully' });
  }
}