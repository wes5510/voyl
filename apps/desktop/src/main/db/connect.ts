import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { join } from 'path'
import { app } from 'electron'

const isDev = process.env.NODE_ENV === 'development'
const DB_NAME = 'database.sqlite'

const dbPath = isDev ? join(app.getAppPath(), DB_NAME) : join(app.getPath('userData'), DB_NAME)

const sqlite = new Database(dbPath)

sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite, {
  logger: isDev,
})
