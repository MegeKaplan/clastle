import { accessibleBy } from '@casl/prisma';
import { AppAbility } from '../../common/casl/defineAbility.js';
import { UserRepository } from './user.repository.js';
import { UUID } from 'crypto';
import { UserStatus } from '../../generated/prisma/enums.js';
import { AppError } from '../../common/errors/app-error.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class UserService {
  constructor(private userRepository: UserRepository) { }

  async getUsers(ability: AppAbility, query: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    const where = {
      ...accessibleBy(ability).User,
      role: query.role,
    };

    const users = await this.userRepository.getUsers({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: query.sortBy
        ? { [query.sortBy]: query.sortOrder }
        : undefined,
    })

    return users
  }

  async approveUser(ability: AppAbility, userId: string) {
    const canApprove = ability.can("approve", "User");

    if (!canApprove) {
      throw new AppError(
        "You do not have permission to approve users",
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN
      );
    }

    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new AppError(
        "User not found",
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }

    if (user.status !== UserStatus.PENDING) {
      throw new AppError(
        "Only pending users can be approved",
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT
      );
    }

    const result = await this.userRepository.updateUserById(
      userId,
      { status: UserStatus.ACTIVE }
    );

    return result;
  }

  async rejectUser(ability: AppAbility, userId: string) {
    const canReject = ability.can("reject", "User");

    if (!canReject) {
      throw new AppError(
        "You do not have permission to reject users",
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN
      );
    }

    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new AppError(
        "User not found",
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }

    if (user.status !== UserStatus.PENDING) {
      throw new AppError(
        "Only pending users can be rejected",
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT
      );
    }

    const result = await this.userRepository.updateUserById(
      userId,
      { status: UserStatus.REJECTED }
    );

    return result;
  }
}