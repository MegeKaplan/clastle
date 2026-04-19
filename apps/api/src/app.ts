import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import { envSchema } from './config/env.js'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import fastifyAutoload from '@fastify/autoload'
import { AppError } from './common/errors/app-error.js'
import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = Fastify()

app.register(fastifyEnv, {
  confKey: "config",
  schema: envSchema,
  dotenv: true
})

app.setErrorHandler((err, req, reply) => {
  const isAppError = err instanceof AppError

  reply.status(isAppError ? err.statusCode : 500).send({
    success: false,
    message: isAppError ? err.message : "Something went wrong",
    code: isAppError ? err.code : "INTERNAL_ERROR",
    details: isAppError ? err.details : null
  })
})

app.register(fastifyAutoload, {
  dir: join(__dirname, 'modules'),
  matchFilter: (path) => path.endsWith("index.ts"),
  prefix: "/api"
})

app.after(() => {
  app.register(fastifyCookie, {
    secret: app.config.COOKIE_SECRET,
    parseOptions: {}
  } as FastifyCookieOptions)
})

app.get('/', async (request, reply) => {
  return { message: 'Hello world!' }
})

export default app