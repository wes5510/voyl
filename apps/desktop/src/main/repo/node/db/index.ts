import { count, eq } from 'drizzle-orm'
import * as _db from '../../shared/db.js'
import { nodes, Node, NewNode } from './schema.js'

export { TABLE_NAME } from './const.js'

export const createTable = async (): Promise<void> => {
  await _db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS nodes (
      id TEXT PRIMARY KEY NOT NULL,
      child_ids TEXT NOT NULL DEFAULT '[]',
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT ''
    )
  `)
}

export const exists = async ({ id }): Promise<boolean> => {
  const result = await _db.connection
    .select({ count: count() })
    .from(nodes)
    .where(eq(nodes.id, id))

  return result[0].count > 0
}

export const update = async (data: Node): Promise<void> => {
  await _db.connection
    .update(nodes)
    .set({
      childIds: data.childIds,
      title: data.title,
      content: data.content,
    })
    .where(eq(nodes.id, data.id))
}

export const add = async (newNode: NewNode): Promise<void> => {
  await _db.connection.insert(nodes).values(newNode)
}
