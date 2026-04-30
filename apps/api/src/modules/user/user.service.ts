import { accessibleBy } from '@casl/prisma';
import { AppAbility } from '../../common/casl/defineAbility.js';
import { UserRepository } from './user.repository.js';
import { UserStatus } from '../../generated/prisma/enums.js';
import { AppError } from '../../common/errors/app-error.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { User } from './user.model.js';
import { hashPassword } from '../../common/utils/password.js';

export class UserService {
  constructor(private userRepository: UserRepository) { }

  async getUsers(ability: AppAbility, query: any, includeDeleted: boolean = false) {
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
    }, includeDeleted)

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

  async createUser(ability: AppAbility, data: any) {
    const canCreate = ability.can("create", "User");

    if (!canCreate) {
      throw new AppError(
        "You do not have permission to create users",
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN
      );
    }

    const passwordHash = await hashPassword(data.password);

    const userData: User = {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "USER",
      onboardingCompleted: false,
    }

    const existingUser = await this.userRepository.findUserByEmail(data.email);

    if (existingUser && existingUser.deletedAt) {
      await this.userRepository.deleteUserById(existingUser.id);
    }

    else if (existingUser) {
      throw new AppError(
        "User already exists",
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT
      );
    }

    const result = await this.userRepository.createUser(userData);

    return result;
  }

  async updateUser(ability: AppAbility, userId: string, updateData: any) {
    const canUpdate = ability.can("update", "User");

    if (!canUpdate) {
      throw new AppError(
        "You do not have permission to update users",
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

    const result = await this.userRepository.updateUserById(
      userId,
      updateData
    );

    return result;
  }

  async deleteUser(ability: AppAbility, userId: string, hardDelete: boolean = false) {
    const canDelete = ability.can("delete", "User");

    if (!canDelete) {
      throw new AppError(
        "You do not have permission to delete users",
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

    if (hardDelete) {
      await this.userRepository.deleteUserById(userId);
    } else {
      await this.userRepository.updateUserById(userId, { deletedAt: new Date() });
    }

    return;
  }
}