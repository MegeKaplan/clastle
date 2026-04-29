import { FastifyInstance } from 'fastify';
import { ClubController } from './club.controller.js';

export class ClubRoutes {
  constructor(private app: FastifyInstance, private clubController: ClubController) { }

  async setup() {
    this.app.get('/', (req, res) => this.clubController.getClubs(req, res));
    this.app.post('/:clubId/join', (req, res) => this.clubController.joinClub(req, res));
    this.app.post('/:clubId/leave', (req, res) => this.clubController.leaveClub(req, res));
  }
}