import { z } from 'zod'

export const envSchema = z.object({
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_POSTGRES_PORT: z.coerce.number(),
  DATABASE_REDIS_PORT: z.coerce.number().optional().default(6379),
  APP_VERSION: z.coerce.number().default(1),
  SMS_ENABLED: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((value) => value === 'true'),
  FRONTEND_URL: z.string().optional(),
  SYNC_SECRET: z.string().optional(),
  DISPARO_PRO_URL: z.coerce.string().optional().default('https://placeholder.local'),
  DISPARO_PRO_TOKEN: z.coerce.string().optional().default('placeholder'),
  DATABASE_REDIS_URL: z.coerce.string().optional().default('localhost'),
  DATABASE_REDIS_USERNAME: z.coerce.string().optional().default('default'),
  DATABASE_REDIS_PASSWORD: z.coerce.string().optional().default(''),
})

export type Env = z.infer<typeof envSchema>
