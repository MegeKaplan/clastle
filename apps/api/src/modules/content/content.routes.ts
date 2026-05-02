import { FastifyInstance } from 'fastify';
import { ContentController } from './content.controller.js';

export class ContentRoutes {
  constructor(private app: FastifyInstance, private contentController: ContentController) { }

  async setup() {
    this.app.get('/', (req, res) => this.contentController.getContents(req, res));
    this.app.get('/:contentId', (req, res) => this.contentController.getContent(req, res));
    this.app.post('/', (req, res) => this.contentController.createContent(req, res));
    this.app.patch('/:contentId', (req, res) => this.contentController.updateContent(req, res));
    this.app.delete('/:contentId', (req, res) => this.contentController.deleteContent(req, res));
  }
}