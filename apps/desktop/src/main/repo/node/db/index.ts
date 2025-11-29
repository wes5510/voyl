import { count, eq } from 'drizzle-orm'
import Db from '../../shared/db.js'
import { nodes, Node, NewNode } from './schema.js'
import { TABLE_NAME } from './const.js'

export type { Node, NewNode }
export { TABLE_NAME }

export async function createTable(): Promise<void> {
  await Db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id TEXT PRIMARY KEY NOT NULL,
      parent_id TEXT,
      child_ids TEXT NOT NULL DEFAULT '[]',
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT ''
    )
  `)
}

export async function exists({ id }: { id: string }): Promise<boolean> {
  const result = await Db.connection
    .select({ count: count() })
    .from(nodes)
    .where(eq(nodes.id, id))

  return result[0].count > 0
}

export async function update(data: Node): Promise<void> {
  await Db.connection
    .update(nodes)
    .set({
      parentId: data.parentId,
      childIds: data.childIds,
      title: data.title,
      content: data.content,
    })
    .where(eq(nodes.id, data.id))
}

export async function add(newNode: NewNode): Promise<void> {
  await Db.connection.insert(nodes).values(newNode)
}

export async function getChildIds({ id }: { id: string }): Promise<string[]> {
  const result = await Db.connection
    .select({ childIds: nodes.childIds })
    .from(nodes)
    .where(eq(nodes.id, id))

  return result[0]?.childIds ?? []
}

export async function getNodeById({ id }: { id: string }): Promise<Node | null> {
  const result = await Db.connection
    .select({
      id: nodes.id,
      parentId: nodes.parentId,
      childIds: nodes.childIds,
      title: nodes.title,
      content: nodes.content,
    })
    .from(nodes)
    .where(eq(nodes.id, id))

  return result[0] ?? null
}

export async function getParentId({ id }: { id: string }): Promise<string | null> {
  const result = await Db.connection
    .select({ parentId: nodes.parentId })
    .from(nodes)
    .where(eq(nodes.id, id))

  return result[0]?.parentId ?? null
}

export async function remove({ id }: { id: string }): Promise<void> {
  await Db.connection.delete(nodes).where(eq(nodes.id, id))
}
