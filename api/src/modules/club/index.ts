import { FastifyInstance } from 'fastify';
import { prisma } from '../../common/prisma/client.js';
import { ClubRoutes } from './club.routes.js';
import { ClubController } from './club.controller.js';
import { ClubService } from './club.service.js';
import { ClubRepository } from './club.repository.js';

export default async function clubModule(app: FastifyInstance) {
  const clubRepository = new ClubRepository(prisma);
  const clubService = new ClubService(clubRepository);
  const clubController = new ClubController(clubService);

  const clubRoutes = new ClubRoutes(app, clubController);

  await clubRoutes.setup();
}

export const autoPrefix = '/clubs';