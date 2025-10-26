import * as db from '../../shared/db.js'
import { count, eq, sql } from 'drizzle-orm'
import { App, app } from './schema.js'

export { TABLE_NAME } from './const.js'

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
  await db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS app (
      version TEXT NOT NULL DEFAULT '0.0.0',
      workspace_path TEXT
    )
  `)
}

export const exists = async (): Promise<boolean> => {
  try {
    const result = await db.connection.select({ count: count() }).from(app)
    return result[0].count > 0
  } catch {
    return false
  }
}

export const removeTable = async (): Promise<void> => {
  await db.connection.delete(app)
}

export const add = async (data: App): Promise<void> => {
  await db.connection.insert(app).values(data)
}

export const update = async (data: App): Promise<void> => {
  await db.connection.update(app).set(data).where(eq(app.version, data.version))
}
