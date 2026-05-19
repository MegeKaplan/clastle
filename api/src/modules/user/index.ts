import { FastifyInstance } from 'fastify';
import { prisma } from '../../common/prisma/client.js';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { UserRoutes } from './user.routes.js';

export default async function userModule(app: FastifyInstance) {
  const userRepository = new UserRepository(prisma);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  const userRoutes = new UserRoutes(app, userController);

  await userRoutes.setup();
}

export const autoPrefix = '/users';