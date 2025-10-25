import * as db from '../shared/db.js'
import { sql } from 'drizzle-orm'

export const existsTable = async (): Promise<boolean> => {
  try {
    const result = await db.connection.get<{ name: string }>(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name='app'`,
    )
    return !!result
  } catch {
    return false
  }
}

export const createTable = async (): Promise<void> => {
  db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS app (
      version TEXT NOT NULL DEFAULT '0.0.0',
      workspace_path TEXT
    )
  `)
}
