import Database from 'better-sqlite3'
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { join } from 'path'
import { app } from 'electron'

const isDev = process.env.NODE_ENV === 'development'
const DB_NAME = 'database.sqlite'

let dbInstance: BetterSQLite3Database | null = null
let sqliteInstance: Database.Database | null = null

/**
 * DB 연결 초기화 (지연 초기화)
 */
export function initializeDatabase(): void {
  if (dbInstance) return // 이미 초기화됨

  const dbPath = isDev ? join(app.getAppPath(), DB_NAME) : join(app.getPath('userData'), DB_NAME)
  
  sqliteInstance = new Database(dbPath)
  sqliteInstance.pragma('journal_mode = WAL')
  
  dbInstance = drizzle(sqliteInstance, {
    logger: isDev,
  })
}

/**
 * DB 인스턴스 가져오기
 */
export function getDatabase(): BetterSQLite3Database {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return dbInstance
}

/**
 * DB 연결 종료
 */
export function closeDatabase(): void {
  if (sqliteInstance) {
    sqliteInstance.close()
    sqliteInstance = null
    dbInstance = null
  }
}

// 이전 버전과의 호환성을 위한 export (점진적 마이그레이션용)
export const db = new Proxy({} as BetterSQLite3Database, {
  get(_target, prop) {
    const database = getDatabase()
    return database[prop as keyof BetterSQLite3Database]
  }
})
