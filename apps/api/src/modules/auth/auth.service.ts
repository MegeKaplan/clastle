import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { AppError } from '../../common/errors/app-error.js';
import { RegisterRequest } from './auth.dto.js';
import { AuthUser } from './auth.model.js';
import { AuthRepository } from './auth.repository.js';
import { generateAccessToken, generateRefreshToken, hashPassword } from './auth.utils.js';

export class AuthService {
  constructor(private authRepository: AuthRepository) { }

  async register(body: RegisterRequest) {
    const existing = await this.authRepository.findByEmail(body.email);
    if (existing) throw new AppError(
      "User already exist",
      StatusCodes.CONFLICT,
      ReasonPhrases.CONFLICT
    )

    const passwordHash = await hashPassword(body.password)

    const authUser: AuthUser = {
      email: body.email,
      passwordHash,
      firstName: body.firstName,
      lastName: body.lastName,
    }

    const user = await this.authRepository.create(authUser);

    const tokens = {
      accessToken: generateAccessToken({ userId: user.id, email: user.email }),
      refreshToken: generateRefreshToken()
    }

    return { user, tokens }
  }
}