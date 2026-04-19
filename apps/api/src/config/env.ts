export const envSchema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: { type: 'string', default: 3001 },
    JWT_SECRET: { type: "string" },
    COOKIE_SECRET: { type: "string" },
    REDIS_HOST: { type: "string" },
    REDIS_PORT: { type: "string" },
    REDIS_PASSWORD: { type: "string" }
  }
}

export type Env = {
  PORT: string
  JWT_SECRET: string
  COOKIE_SECRET: string
  REDIS_HOST: string
  REDIS_PORT: string
  REDIS_PASSWORD: string
}