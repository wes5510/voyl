import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import fs from 'fs-extra'

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

    // 3. 새로운 DB 인스턴스 생성
    await createDatabase(cachePath)

    // 4. 스키마 생성/마이그레이션
    await createSchema()

    console.log('✅ Database cache initialized (empty, ready for lazy loading)')
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

    console.log('✅ Database schema created successfully')
  } catch (error) {
    console.error('Failed to create schema:', error)
    throw error
  }
}

/**
 * 런타임 스키마 생성
 *
 * ✅ 확정된 최고의 방법: Drizzle migrate 함수!
 */
async function createSchemaRuntime(): Promise<void> {
  if (!sqlite || !db) {
    throw new Error('Database not initialized')
  }
  
  try {
    // Better-SQLite3는 한 번에 하나의 SQL 문만 실행 가능
    // 직접 테이블을 생성
    
    // node_types 테이블
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS node_types (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon_name TEXT,
        color TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `)
    
    // attributes 테이블
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS attributes (
        id TEXT PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        default_value TEXT,
        is_required INTEGER DEFAULT 0 NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `)
    
    // nodes 테이블
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS nodes (
        id TEXT PRIMARY KEY,
        parent_id TEXT REFERENCES nodes(id) ON DELETE SET NULL ON UPDATE CASCADE,
        "index" TEXT NOT NULL,
        attribute_ids TEXT NOT NULL DEFAULT '[]',
        title TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        type_id TEXT REFERENCES node_types(id) ON DELETE SET NULL ON UPDATE CASCADE
      )
    `)
    
    // 인덱스 생성
    sqlite.exec('CREATE INDEX IF NOT EXISTS idx_nodes_parent_id ON nodes(parent_id)')
    sqlite.exec('CREATE INDEX IF NOT EXISTS idx_nodes_type_id ON nodes(type_id)')

    console.log('✅ Database schema created successfully')
  } catch (error) {
    console.error('Failed to create schema:', error)
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