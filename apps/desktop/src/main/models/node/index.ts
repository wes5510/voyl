import * as db from '../../db/node/index.js'
import * as attribute from './attribute/index.js'

export async function updateNodeTitle({ id, title }: { id: string; title: string }) {
  return db.updateNodeTitle({
    id,
    title,
  })
}

export async function getNodeTitleById({ id }: { id: string }) {
  return db.getNodeTitleById({ id })
}

export async function getNodeParentIdById({ id }: { id: string }) {
  return db.getNodeParentIdById({ id })
}

export async function getNodeById({ id }: { id: string }) {
  return db.getNodeById({ id })
}

export async function setNodeParent({ id, newParentId }: { id: string; newParentId?: string }) {
  return db.setNodeParentId({
    id,
    newParentId,
  })
}

export async function getNodeIndexById({ id }: { id: string }) {
  return db.getNodeIndexById({ id })
}

export async function setNodeIndex({ id, index }: { id: string; index: string }) {
  return db.setNodeIndex({ id, index })
}

export async function linkAttributeToNode({
  id,
  attributeId,
}: {
  id: string
  attributeId: string
}) {
  const currentNode = await db.getNodeById({ id })

  if (!currentNode) {
    return undefined
  }

  const currentAttributeIds = currentNode.attributeIds

  if (currentAttributeIds.includes(attributeId)) {
    return currentNode
  }

  return db.updateNodeAttributeIds({ id, attributeIds: [...currentAttributeIds, attributeId] })
}

export async function unlinkAttributeFromNode({
  id,
  attributeId,
}: {
  id: string
  attributeId: string
}) {
  const currentNode = await db.getNodeById({ id })

  if (!currentNode) {
    return undefined
  }

  const currentAttributeIds = currentNode.attributeIds

  if (!currentAttributeIds.includes(attributeId)) {
    return currentNode
  }

  return db.updateNodeAttributeIds({
    id,
    attributeIds: currentAttributeIds.filter((id) => id !== attributeId),
  })
}

export async function updateAttributeValueForNode({
  id,
  attributeId,
  value,
}: {
  id: string
  attributeId: string
  value: unknown
}) {
  const currentNode = await db.getNodeById({ id })

  if (!currentNode || !currentNode.attributeIds.includes(attributeId)) {
    return undefined
  }

  const updatedAttribute = await attribute.updateAttributeValue({ id: attributeId, value })

  return updatedAttribute ? currentNode : undefined
}
