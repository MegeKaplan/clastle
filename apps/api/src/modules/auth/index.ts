import { FastifyInstance } from 'fastify';
import { prisma } from '../../common/prisma/client.js';
import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { AuthRoutes } from './auth.routes.js';

export default async function authModule(app: FastifyInstance) {
  const authRepository = new AuthRepository(prisma);
  const authService = new AuthService(authRepository);
  const authController = new AuthController(authService);

  const authRoutes = new AuthRoutes(app, authController);

  await authRoutes.setup();
}