import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller.js';

export class UserRoutes {
  constructor(private app: FastifyInstance, private userController: UserController) { }

  async setup() {
    this.app.get('/', (req, res) => this.userController.getUsers(req, res));
  }
}

export const autoPrefix = '/users';