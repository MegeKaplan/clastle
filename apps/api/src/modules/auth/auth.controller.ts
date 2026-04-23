import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service.js';
import { LoginRequest, RegisterRequest } from './auth.dto.js';
import { validate } from '../../common/utils/validator.js';
import { AppError } from '../../common/errors/app-error.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class AuthController {
  constructor(private authService: AuthService) { }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as RegisterRequest

    const { success, errors } = validate(RegisterRequest, body);

    if (!success) {
      throw new AppError(
        "Validation failed",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        errors
      )
    }

    const { user, tokens } = await this.authService.register(body);

    reply
      .setCookie('refreshToken', tokens.refreshToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        signed: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60
      })

    reply.code(StatusCodes.CREATED).send({ message: 'User registered successfully', user, tokens: { accessToken: tokens.accessToken } });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as LoginRequest

    const { success, errors } = validate(LoginRequest, body);

    if (!success) {
      throw new AppError(
        "Validation failed",
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        errors
      )
    }

    const { user, tokens } = await this.authService.login(body);

    reply
      .setCookie('refreshToken', tokens.refreshToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        signed: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60
      })

    reply.code(StatusCodes.OK).send({ message: 'User logged in successfully', user, tokens: { accessToken: tokens.accessToken } });
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      throw new AppError(
        "Unauthorized",
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED
      )
    }

    reply.code(StatusCodes.OK).send({ user: request.user });
  }
}