import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import { envSchema } from './config/env.js'

const app = Fastify()

app.register(fastifyEnv, {
  confKey: "config",
  schema: envSchema,
  dotenv: true
})

app.get('/', async (request, reply) => {
  return { message: 'Hello world!' }
})

export default app