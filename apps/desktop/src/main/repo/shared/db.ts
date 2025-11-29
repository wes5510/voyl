import Database from 'better-sqlite3'
import type { Database as DatabaseType } from 'better-sqlite3'
import { app } from 'electron'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import path from 'path'
import { logger } from '../../common/logger.util.js'

const DB_NAME = 'database.sqlite'
const DB_PATH = path.join(app.getPath('userData'), DB_NAME)

const sqlite: DatabaseType = new Database(DB_PATH)
sqlite.pragma('journal_mode = WAL')

const drizzleLogger = {
  logQuery(query: string, params: unknown[]): void {
    logger.debug({ query, params }, 'SQL Query')
  },
}

const connection = drizzle(sqlite, {
  logger: process.env.NODE_ENV === 'development' ? drizzleLogger : false,
})

const Db: {
  sqlite: DatabaseType
  connection: ReturnType<typeof drizzle>
} = {
  sqlite,
  connection,
}

export default Db
