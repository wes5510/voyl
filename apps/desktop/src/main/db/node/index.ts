import { Node, nodes } from './schema.js'
import { db } from '../connect.js'
import { eq, isNull } from 'drizzle-orm'

export async function updateNodeTitle(params: {
  id: string
  title: string
}): Promise<Node | undefined> {
  const ret = await db
    .update(nodes)
    .set({ title: params.title })
    .where(eq(nodes.id, params.id))
    .returning()

  return ret[0] ?? undefined
}

export async function getNodeTitleById({ id }: { id: string }): Promise<string | undefined> {
  const ret = await db.select({ title: nodes.title }).from(nodes).where(eq(nodes.id, id)).limit(1)

  return ret[0]?.title ?? undefined
}

export async function getNodeParentIdById({ id }: { id: string }): Promise<string | undefined> {
  const ret = await db
    .select({ parentId: nodes.parentId })
    .from(nodes)
    .where(eq(nodes.id, id))
    .limit(1)

  return ret[0]?.parentId ?? undefined
}

export async function setNodeParentId({
  id,
  newParentId,
}: {
  id: string
  newParentId?: string
}): Promise<Node | undefined> {
  const ret = await db
    .update(nodes)
    .set({ parentId: newParentId ?? null })
    .where(eq(nodes.id, id))
    .returning()

  return ret[0] ?? undefined
}

export async function getNodeIndexById({ id }: { id: string }): Promise<string | undefined> {
  const ret = await db.select({ index: nodes.index }).from(nodes).where(eq(nodes.id, id)).limit(1)

  return ret[0]?.index ?? undefined
}

export async function setNodeIndex(params: {
  id: string
  index: string
}): Promise<Node | undefined> {
  const ret = await db
    .update(nodes)
    .set({ index: params.index })
    .where(eq(nodes.id, params.id))
    .returning()

  return ret[0] ?? undefined
}

export async function updateNodeAttributeIds({
  id,
  attributeIds,
}: {
  id: string
  attributeIds: string[]
}) {
  const ret = await db.update(nodes).set({ attributeIds }).where(eq(nodes.id, id)).returning()

  return ret[0] ?? undefined
}

export async function getNodeById({ id }: { id: string }): Promise<Node | undefined> {
  const ret = await db
    .select({
      id: nodes.id,
      parentId: nodes.parentId,
      index: nodes.index,
      attributeIds: nodes.attributeIds,
      title: nodes.title,
      content: nodes.content,
      typeId: nodes.typeId,
    })
    .from(nodes)
    .where(eq(nodes.id, id))
    .limit(1)

  return ret[0] ?? undefined
}

export async function getRootNodeId(): Promise<string | undefined> {
  const ret = await db.select({ id: nodes.id }).from(nodes).where(isNull(nodes.parentId)).limit(1)

  return ret[0]?.id ?? undefined
}

export async function getChildIds({ parentId }: { parentId: string }): Promise<string[]> {
  const ret = await db.select({ id: nodes.id }).from(nodes).where(eq(nodes.parentId, parentId))

  return ret.map((r) => r.id)
}
