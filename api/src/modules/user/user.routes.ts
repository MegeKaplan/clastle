import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller.js';

export class UserRoutes {
  constructor(private app: FastifyInstance, private userController: UserController) { }

  async setup() {
    this.app.get('/', (req, res) => this.userController.getUsers(req, res));
    this.app.post('/', (req, res) => this.userController.createUser(req, res));
    this.app.post('/:userId/approve', (req, res) => this.userController.approveUser(req, res));
    this.app.post('/:userId/reject', (req, res) => this.userController.rejectUser(req, res));
    this.app.patch('/:userId', (req, res) => this.userController.updateUser(req, res));
    this.app.delete('/:userId', (req, res) => this.userController.deleteUser(req, res));
  }
}