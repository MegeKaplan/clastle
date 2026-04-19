import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { AppError } from '../../common/errors/app-error.js';
import { LoginRequest, RegisterRequest } from './auth.dto.js';
import { AuthUser } from './auth.model.js';
import { AuthRepository } from './auth.repository.js';
import { generateAccessToken, generateRefreshToken, hashPassword, verifyPassword } from './auth.utils.js';

export class AuthService {
  constructor(private authRepository: AuthRepository) { }

  async register(body: RegisterRequest) {
    const existingUser = await this.authRepository.findUserByEmail(body.email);
    if (existingUser) throw new AppError(
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

    const user = await this.authRepository.createUser(authUser);

    const tokens = {
      accessToken: generateAccessToken({ userId: user.id, email: user.email }),
      refreshToken: generateRefreshToken()
    }

    await this.authRepository.saveRefreshToken(user.id, tokens.refreshToken, 7 * 24 * 60 * 60);

    return { user, tokens }
  }

  async login(body: LoginRequest) {
    const existingUser = await this.authRepository.findUserByEmail(body.email);
    if (!existingUser) throw new AppError(
      "User not found",
      StatusCodes.NOT_FOUND,
      ReasonPhrases.NOT_FOUND
    )

    if (!(await verifyPassword(body.password, existingUser.passwordHash))) {
      throw new AppError(
        "Invalid credentials",
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED
      )
    }

    const tokens = {
      accessToken: generateAccessToken({ userId: existingUser.id, email: existingUser.email }),
      refreshToken: generateRefreshToken()
    }

    await this.authRepository.saveRefreshToken(existingUser.id, tokens.refreshToken, 7 * 24 * 60 * 60);

    return { user: existingUser, tokens }
  }
}