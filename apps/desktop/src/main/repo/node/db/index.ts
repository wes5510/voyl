import { count, eq } from 'drizzle-orm'
import Db from '../../shared/db.js'
import { nodes, Node, NewNode } from './schema.js'
import { TABLE_NAME } from './const.js'

export type { Node }

async function createTable(): Promise<void> {
  await Db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id TEXT PRIMARY KEY NOT NULL,
      child_ids TEXT NOT NULL DEFAULT '[]',
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT ''
    )
  `)
}

async function exists({ id }: { id: string }): Promise<boolean> {
  const result = await Db.connection
    .select({ count: count() })
    .from(nodes)
    .where(eq(nodes.id, id))

  return result[0].count > 0
}

async function update(data: Node): Promise<void> {
  await Db.connection
    .update(nodes)
    .set({
      childIds: data.childIds,
      title: data.title,
      content: data.content,
    })
    .where(eq(nodes.id, data.id))
}

async function add(newNode: NewNode): Promise<void> {
  await Db.connection.insert(nodes).values(newNode)
}

const NodeDb = {
  createTable,
  exists,
  update,
  add,
  TABLE_NAME,
}

export default NodeDb
