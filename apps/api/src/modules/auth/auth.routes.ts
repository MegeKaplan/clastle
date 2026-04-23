import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller.js';

export class AuthRoutes {
  constructor(private app: FastifyInstance, private authController: AuthController) { }

  async setup() {
    this.app.post('/register', (req, res) => this.authController.register(req, res));
    this.app.post('/login', (req, res) => this.authController.login(req, res));
    this.app.get("/me", (req, res) => this.authController.getMe(req, res));
  }
}