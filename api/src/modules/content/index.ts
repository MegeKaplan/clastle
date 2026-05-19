import { FastifyInstance } from 'fastify';
import { prisma } from '../../common/prisma/client.js';
import { ContentRepository } from './content.repository.js';
import { ContentService } from './content.service.js';
import { ContentController } from './content.controller.js';
import { ContentRoutes } from './content.routes.js';

export default async function contentModule(app: FastifyInstance) {
  const contentRepository = new ContentRepository(prisma);
  const contentService = new ContentService(contentRepository);
  const contentController = new ContentController(contentService);

  const contentRoutes = new ContentRoutes(app, contentController);

  await contentRoutes.setup();
}

export const autoPrefix = '/contents';