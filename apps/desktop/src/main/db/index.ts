import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import fs from 'fs-extra'
import { dirname } from 'path'

// 현재 DB 인스턴스 (재초기화 가능하도록 변수로 관리)
let sqlite: Database.Database | null = null
let db: ReturnType<typeof drizzle> | null = null

/**
 * DB 캐시 초기화 (Lazy load 전략)
 * @param cachePath 캐시 DB 파일 경로
 */
export async function initialize(cachePath: string): Promise<void> {
  try {
    // 1. 기존 DB 연결 정리
    await closeDatabase()

    // 2. 캐시 파일 삭제 (다중 기기 동기화로 outdated 될 수 있어 매번 새로 시작)
    if (await fs.pathExists(cachePath)) {
      await fs.remove(cachePath)
    }

    // 3. 캐시 디렉토리 생성
    const dbDir = dirname(cachePath) // path.dirname으로 안전하게 디렉토리 추출
    await fs.ensureDir(dbDir)

    // 4. 새로운 DB 인스턴스 생성
    await createDatabase(cachePath)

    // 5. 스키마 생성/마이그레이션
    await createSchema()
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

/**
 * 기존 DB 연결 정리
 */
async function closeDatabase(): Promise<void> {
  if (sqlite) {
    sqlite.close()
    sqlite = null
    db = null
  }
}

/**
 * 새로운 DB 인스턴스 생성
 */
async function createDatabase(cachePath: string): Promise<void> {
  sqlite = new Database(cachePath)
  sqlite.pragma('journal_mode = WAL')

  db = drizzle(sqlite, {
    logger: process.env.NODE_ENV === 'development',
  })
}

/**
 * 스키마 생성/마이그레이션
 *
 * 🎯 권장 방법: drizzle-kit push 활용 (개발 시)
 * 🚀 런타임 방법: 기존 스키마 import + CREATE TABLE (현재 구현)
 */
async function createSchema(): Promise<void> {
  try {
    // 🎯 최적 방법: drizzle-kit push 사용
    // Production 환경에서는 사전에 `npx drizzle-kit push`로 스키마 생성
    // 하지만 cache DB는 매번 재생성되므로 런타임 생성 필요

    await createSchemaRuntime()
  } catch (error) {
    console.error('Failed to create schema:', error)
    throw error
  }
}

/**
 * 런타임 스키마 생성
 * Drizzle migrate 함수 사용
 */
async function createSchemaRuntime(): Promise<void> {
  try {
    // db가 null이면 에러
    if (!db) {
      throw new Error('Database instance not created')
    }

    // Drizzle 공식 migrate 함수 사용
    const { migrate } = await import('drizzle-orm/better-sqlite3/migrator')
    const { join } = await import('path')

    // __dirname 대체 (ES modules)
    const migrationsPath = join(process.cwd(), 'src/main/db/migrations')

    await migrate(db, {
      migrationsFolder: migrationsPath,
    })
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

/**
 * 💡 Lazy Load 전략
 * - DB는 빈 캐시로 시작
 * - 데이터는 Repository 레이어에서 필요시 파일에서 읽어 캐시에 저장
 * - 상세 구현은 Repository 레이어 구현 시 정의
 */

/**
 * DB 인스턴스 반환 (기존 connect.ts 대체)
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initialize() first.')
  }
  return db
}
