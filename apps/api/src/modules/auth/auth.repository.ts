import { RedisClientType } from 'redis';
import { PrismaClient } from '../../generated/prisma/client.js';
import { AuthUser } from './auth.model.js';

export class AuthRepository {
  constructor(private prisma: PrismaClient, private redis: RedisClientType) { }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: AuthUser) {
    return this.prisma.user.create({ data });
  }

  async saveRefreshToken(userId: string, refreshToken: string, ttl: number) {
    const key = `refresh_token:${userId}`;
    await this.redis.set(key, refreshToken, {
      expiration: {
        type: "EX",
        value: ttl
      }
    });
  }
}