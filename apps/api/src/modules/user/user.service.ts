import { accessibleBy } from '@casl/prisma';
import { AppAbility } from '../../common/casl/defineAbility.js';
import { UserRepository } from './user.repository.js';

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
}