import * as db from '../shared/db.js'
import * as schema from './schema.js'
import { generateDrizzleJson, generateMigration } from 'drizzle-kit/api'

export const exists = async (): Promise<boolean> => {
  const ret = await db.connection.select().from(schema.app).limit(1)
  return !!ret[0]
}

export const createTable = async (): Promise<void> => {
  // 1. 스키마로부터 CREATE TABLE SQL 생성
  const prevSchema = {} // 빈 스키마 (초기 생성)
  const currentSchema = { app: schema.app }

  const statements = await generateMigration(
    generateDrizzleJson(prevSchema),
    generateDrizzleJson(currentSchema),
  )

  // CREATE TABLE IF NOT EXISTS 실행
  for (const statement of statements) {
    db.sqlite.exec(statement)
  }
}
