import Db from '../../shared/db.js'
import { count, sql } from 'drizzle-orm'
import { App, app } from './schema.js'
import { TABLE_NAME } from './const.js'

export type { App }

async function existsTable(): Promise<boolean> {
  try {
    const result = await Db.connection.get<{ name: string }>(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name='app'`,
    )
    return !!result
  } catch {
    return false
  }
}

const createTable = async (): Promise<void> => {
  await Db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS app (
      version TEXT NOT NULL DEFAULT '0.0.0',
      workspace_dir_path TEXT
    )
  `)
}

const exists = async (): Promise<boolean> => {
  try {
    const result = await Db.connection.select({ count: count() }).from(app)
    return result[0].count > 0
  } catch {
    return false
  }
}

const removeTable = async (): Promise<void> => {
  await Db.connection.delete(app)
}

const add = async (data: App): Promise<void> => {
  await Db.connection.insert(app).values(data)
}

const update = async (data: App): Promise<void> => {
  await Db.connection.update(app).set(data).run()
}

const getWorkspaceDirPath = async (): Promise<string | null> => {
  const result = await Db.connection
    .select({ workspaceDirPath: app.workspaceDirPath })
    .from(app)
    .limit(1)

  return result[0].workspaceDirPath ?? null
}

const AppDb = {
  existsTable,
  createTable,
  exists,
  removeTable,
  add,
  update,
  getWorkspaceDirPath,
  TABLE_NAME,
}

export default AppDb
