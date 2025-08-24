import type { Config } from 'drizzle-kit'

export default {
  schema: './src/main/db/*/schema.ts',
  out: './src/main/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: ':memory:', // migration 생성용 임시 DB
  },
} satisfies Config