import NodeRepo from '../../repo/node/index.js'
import * as db from '../../db/node/index.js'
import AttributeModel from './attribute/index.js'

async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  NodeRepo.setPath({ workspaceDirPath })
  await NodeRepo.initialize()
}

async function sync({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  NodeRepo.setPath({ workspaceDirPath })
  await NodeRepo.sync()
}

async function updateNodeTitle({ id, title }: { id: string; title: string }) {
  return db.updateNodeTitle({
    id,
    title,
  })
}

async function getNodeTitleById({ id }: { id: string }) {
  return db.getNodeTitleById({ id })
}

async function getNodeParentIdById({ id }: { id: string }) {
  return db.getNodeParentIdById({ id })
}

async function setNodeParent({
  id,
  newParentId,
}: {
  id: string
  newParentId?: string
}) {
  return db.setNodeParentId({
    id,
    newParentId,
  })
}

async function getNodeIndexById({ id }: { id: string }) {
  return db.getNodeIndexById({ id })
}

async function setNodeIndex({ id, index }: { id: string; index: string }) {
  return db.setNodeIndex({ id, index })
}

async function linkAttributeToNode({
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

  return db.updateNodeAttributeIds({
    id,
    attributeIds: [...currentAttributeIds, attributeId],
  })
}

async function unlinkAttributeFromNode({
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

async function updateAttributeValueForNode({
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

  const updatedAttribute = await AttributeModel.updateAttributeValue({
    id: attributeId,
    value,
  })

  return updatedAttribute ? currentNode : undefined
}

async function getNodeById({ id }: { id: string }) {
  return db.getNodeById({ id })
}

const NodeModel = {
  updateNodeTitle,
  getNodeTitleById,
  getNodeParentIdById,
  setNodeParent,
  getNodeIndexById,
  setNodeIndex,
  linkAttributeToNode,
  unlinkAttributeFromNode,
  updateAttributeValueForNode,
  getNodeById,
  initialize,
  sync,
}

export default NodeModel
