export const envSchema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: { type: 'string', default: 3001 },
    JWT_SECRET: { type: "string" },
    COOKIE_SECRET: { type: "string" }
  }
}

export type Env = {
  PORT: string
  JWT_SECRET: string
  COOKIE_SECRET: string
}