import Db from '../../shared/db.js'
import { count, sql } from 'drizzle-orm'
import { App, app } from './schema.js'
import { TABLE_NAME } from './const.js'

export type { App }
export { TABLE_NAME }

export async function existsTable(): Promise<boolean> {
  try {
    const result = await Db.connection.get<{ name: string }>(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name='app'`,
    )
    return !!result
  } catch {
    return false
  }
}

export async function createTable(): Promise<void> {
  await Db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS app (
      version TEXT NOT NULL DEFAULT '0.0.0',
      workspace_dir_path TEXT
    )
  `)
}

export async function exists(): Promise<boolean> {
  try {
    const result = await Db.connection.select({ count: count() }).from(app)
    return result[0].count > 0
  } catch {
    return false
  }
}

export async function removeTable(): Promise<void> {
  await Db.connection.delete(app)
}

export async function add(data: App): Promise<void> {
  await Db.connection.insert(app).values(data)
}

export async function update(data: App): Promise<void> {
  await Db.connection.update(app).set(data).run()
}

export async function getWorkspaceDirPath(): Promise<string | null> {
  const result = await Db.connection
    .select({ workspaceDirPath: app.workspaceDirPath })
    .from(app)
    .limit(1)

  return result[0].workspaceDirPath ?? null
}

export async function remove(): Promise<void> {
  await Db.connection.delete(app)
}
