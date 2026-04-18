export const envSchema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: { type: 'string', default: 3001 }
  }
}

export type Env = {
  PORT: string
}