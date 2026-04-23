import { FastifyInstance } from "fastify";
import { defineAbilityForUser } from "../common/casl/defineAbility.js";
import { verifyAccessToken } from "../common/utils/token.js";
import { prisma } from "../common/prisma/client.js";
import fastifyPlugin from "fastify-plugin";

const TOKEN_PREFIX = "Bearer ";

export default fastifyPlugin(async function authPlugin(app: FastifyInstance) {
  app.addHook("preHandler", async (req) => {
    const authorization = req.headers.authorization;

    req.user = null;
    req.userAbility = defineAbilityForUser(undefined);

    if (!authorization || !authorization.startsWith(TOKEN_PREFIX)) {
      return;
    }

    const token = authorization.slice(TOKEN_PREFIX.length).trim();

    let payload;
    try {
      payload = await verifyAccessToken(token, app.config.JWT_SECRET);
    } catch {
      return;
    }

    if (typeof payload !== "object" || !payload?.userId) {
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return;
    }

    req.user = user;
    req.userAbility = defineAbilityForUser(user);
  });
});