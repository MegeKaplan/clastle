import { accessibleBy } from '@casl/prisma';
import { AppAbility } from '../../common/casl/defineAbility.js';
import { ClubRepository } from './club.repository.js';
import { AppError } from '../../common/errors/app-error.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class ClubService {
  constructor(private clubRepository: ClubRepository) { }

  async getClubs(ability: AppAbility, query: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    const where = {
      ...accessibleBy(ability).User,
    };

    const clubs = await this.clubRepository.getClubs({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: query.sortBy
        ? { [query.sortBy]: query.sortOrder }
        : undefined,
    })

    return clubs
  }

  async joinClub(ability: AppAbility, clubId: string, userId: string) {
    if (!ability.can('join', 'Club')) {
      throw new AppError('You do not have permission to join this club', StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
    }

    const existingMembership = await this.clubRepository.findMembership(clubId, userId);

    if (existingMembership) {
      throw new AppError(
        'You are already a member of this club',
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT
      )
    }

    const result = await this.clubRepository.createMembership(clubId, userId);

    return result;
  }

  async leaveClub(ability: AppAbility, clubId: string, userId: string) {
    if (!ability.can('leave', 'Club')) {
      throw new AppError('You do not have permission to leave this club', StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
    }

    const existingMembership = await this.clubRepository.findMembership(clubId, userId);

    if (!existingMembership) {
      throw new AppError(
        'You are not a member of this club',
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      )
    }

    const result = await this.clubRepository.deleteMembership(clubId, userId);

    return result;
  }
}