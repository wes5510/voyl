import { count } from 'drizzle-orm'
import Db from '../../shared/db.js'
import { TABLE_NAME } from './const.js'
import { NewWorkspace, workspace, Workspace } from './schema.js'

export type { Workspace }
export { TABLE_NAME }

export async function createTable(): Promise<void> {
  await Db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      node_types TEXT NOT NULL DEFAULT '[]',
      attributes TEXT NOT NULL DEFAULT '[]'
    )
  `)
}

export async function exists(): Promise<boolean> {
  try {
    const result = await Db.connection
      .select({ count: count() })
      .from(workspace)
    return result[0].count > 0
  } catch {
    return false
  }
}

export async function update(data: Workspace): Promise<void> {
  await Db.connection.update(workspace).set(data).run()
}

export async function removeTable(): Promise<void> {
  await Db.connection.delete(workspace)
}

export async function add(data: NewWorkspace): Promise<void> {
  await Db.connection.insert(workspace).values(data)
}

export async function remove(): Promise<void> {
  await Db.connection.delete(workspace)
}
