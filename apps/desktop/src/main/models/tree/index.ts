import * as db from '../../db/node/index.js'

export async function getRootNodeId() {
  const rootNodeId = await db.getRootNodeId()

  if (!rootNodeId) {
    throw new Error('Root node not found')
  }

  return rootNodeId
}

export async function getNode({ nodeId }: { nodeId: string }): Promise<{
  id: string
  parentId?: string
  childIds: string[]
  title: string
  content: string
}> {
  const node = await db.getNodeById({ id: nodeId })

  if (!node) {
    throw new Error(`Node with id ${nodeId} not found`)
  }

  const childIds = await db.getChildIds({ parentId: node.id })

  return {
    id: node.id,
    parentId: node.parentId ?? undefined,
    childIds,
    title: node.title,
    content: node.content,
  }
}
