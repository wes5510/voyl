import { db } from '../connect.js'
import { nodeTypes, type NewNodeType, type NodeType } from './schema.js'
import { eq } from 'drizzle-orm'

export const createNodeType = async (data: Omit<NewNodeType, 'id'>): Promise<NodeType> => {
  const [newNodeType] = await db.insert(nodeTypes).values(data).returning()
  return newNodeType
}

export const getAllNodeTypes = async (): Promise<NodeType[]> => {
  return await db.select().from(nodeTypes)
}

export const getNodeTypeById = async ({ id }: { id: string }): Promise<NodeType | undefined> => {
  const [nodeType] = await db.select().from(nodeTypes).where(eq(nodeTypes.id, id))
  return nodeType || undefined
}

export const getDefinedAttributeNamesByNodeTypeId = async ({
  nodeTypeId,
}: {
  nodeTypeId: string
}): Promise<string[] | undefined> => {
  const nodeType = await getNodeTypeById({ id: nodeTypeId })
  return nodeType?.definedAttributeNames ?? undefined
}

export const updateNodeType = async ({
  id,
  data,
}: {
  id: string
  data: Partial<Omit<NewNodeType, 'id'>>
}): Promise<NodeType | undefined> => {
  const [updatedNodeType] = await db
    .update(nodeTypes)
    .set(data)
    .where(eq(nodeTypes.id, id))
    .returning()
  return updatedNodeType || undefined
}

export const deleteNodeTypeById = async ({ id }: { id: string }): Promise<boolean> => {
  const result = await db
    .delete(nodeTypes)
    .where(eq(nodeTypes.id, id))
    .returning({ deletedId: nodeTypes.id })
  return result.length > 0
}
