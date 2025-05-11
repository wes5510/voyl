import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { schema } from './schemas/index.js'
import { join } from 'path'
import { app } from 'electron'

const dbPath =
  process.env.NODE_ENV === 'development'
    ? join(app.getAppPath(), 'database.sqlite')
    : join(app.getPath('userData'), 'database.sqlite')

console.log(`Database path: ${dbPath}`)

const sqlite = new Database(dbPath)

sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite, {
  schema,
  logger: process.env.NODE_ENV === 'development',
})
