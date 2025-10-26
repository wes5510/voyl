import { count } from 'drizzle-orm'
import Db from '../../shared/db.js'
import { TABLE_NAME } from './const.js'
import { NewWorkspace, workspace, Workspace } from './schema.js'

async function createTable(): Promise<void> {
  await Db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      node_types TEXT NOT NULL DEFAULT '[]',
      attributes TEXT NOT NULL DEFAULT '[]'
    )
  `)
}

async function exists(): Promise<boolean> {
  try {
    const result = await Db.connection
      .select({ count: count() })
      .from(workspace)
    return result[0].count > 0
  } catch {
    return false
  }
}

async function update(data: Workspace): Promise<void> {
  await Db.connection.update(workspace).set(data).run()
}

async function removeTable(): Promise<void> {
  await Db.connection.delete(workspace)
}

async function add(data: NewWorkspace): Promise<void> {
  await Db.connection.insert(workspace).values(data)
}

const WorkspaceDb = {
  createTable,
  exists,
  update,
  removeTable,
  add,
  TABLE_NAME,
}

export default WorkspaceDb
