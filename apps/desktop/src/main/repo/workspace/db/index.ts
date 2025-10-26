import { count } from 'drizzle-orm'
import * as _db from '../../shared/db.js'
import { TABLE_NAME } from './const.js'
import { NewWorkspace, workspace, Workspace } from './schema.js'

export { TABLE_NAME } from './const.js'

export const createTable = async (): Promise<void> => {
  await _db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      node_types TEXT NOT NULL DEFAULT '[]',
      attributes TEXT NOT NULL DEFAULT '[]'
    )
  `)
}

export const exists = async (): Promise<boolean> => {
  try {
    const result = await _db.connection
      .select({ count: count() })
      .from(workspace)
    return result[0].count > 0
  } catch {
    return false
  }
}

export const update = async (data: Workspace): Promise<void> => {
  await _db.connection.update(workspace).set(data).run()
}

export const removeTable = async (): Promise<void> => {
  await _db.connection.delete(workspace)
}

export const add = async (data: NewWorkspace): Promise<void> => {
  await _db.connection.insert(workspace).values(data)
}
