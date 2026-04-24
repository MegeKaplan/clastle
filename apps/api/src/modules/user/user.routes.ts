import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller.js';

export class UserRoutes {
  constructor(private app: FastifyInstance, private userController: UserController) { }

  async setup() {
    this.app.get('/', (req, res) => this.userController.getUsers(req, res));
    this.app.post('/:id/approve', (req, res) => this.userController.approveUser(req, res));
    this.app.post('/:id/reject', (req, res) => this.userController.rejectUser(req, res));
  }
}