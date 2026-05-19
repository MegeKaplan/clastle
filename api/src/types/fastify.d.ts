import "fastify"
import { Env } from "../config/env.js"
import { AppAbility } from "../common/casl/defineAbility.ts";
import { User } from "../generated/prisma/client.ts";

declare module 'fastify' {
  interface FastifyInstance {
    config: Env
  }

  interface FastifyRequest {
    user: User | null;
    userAbility: AppAbility;
  }
}
