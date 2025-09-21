import Database from 'better-sqlite3'
import type { Database as DatabaseType } from 'better-sqlite3'
import { app } from 'electron'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import path from 'path'

const DB_NAME = 'database.sqlite'
const DB_PATH = path.join(app.getPath('userData'), DB_NAME)

export const sqlite: DatabaseType = new Database(DB_PATH)
sqlite.pragma('journal_mode = WAL')

export const connection = drizzle(sqlite, {
  logger: process.env.NODE_ENV === 'development',
})
