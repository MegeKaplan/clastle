import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { AppError } from '../../common/errors/app-error.js';
import { LoginRequest, RegisterRequest } from './auth.dto.js';
import { AuthUser } from './auth.model.js';
import { AuthRepository } from './auth.repository.js';
import { AccessTokenPayload, generateAccessToken, generateRefreshToken } from './auth.utils.js';
import { hashPassword, verifyPassword } from '../../common/utils/password.js';
import app from '../../app.js';

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
      role: "USER"
    }

    const user = await this.authRepository.createUser(authUser);

    const tokenPayload: AccessTokenPayload = { userId: user.id, email: user.email, role: user.role };

    const tokens = {
      accessToken: generateAccessToken(tokenPayload, app.config.JWT_SECRET),
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

    const tokenPayload: AccessTokenPayload = { userId: existingUser.id, email: existingUser.email, role: existingUser.role };

    const tokens = {
      accessToken: generateAccessToken(tokenPayload, app.config.JWT_SECRET),
      refreshToken: generateRefreshToken()
    }

    await this.authRepository.saveRefreshToken(existingUser.id, tokens.refreshToken, 7 * 24 * 60 * 60);

    return { user: existingUser, tokens }
  }
}