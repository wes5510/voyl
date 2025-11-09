import NodeRepo, { type NewNode, type Node } from '../../repo/node/index.js'

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

function addNode(node: NewNode): Promise<Node> {
  return NodeRepo.addNode(node)
}

async function getNodeById({ id }: { id: string }) {
  return NodeRepo.getNodeById({ id })
}

async function updateNodeTitle({ id, title }: { id: string; title: string }) {
  return NodeRepo.updateNodeTitle({ id, title })
}

async function isExist({ id }: { id: string }) {
  return NodeRepo.isNodeExist({ id })
}

async function getParentId({ id }: { id: string }) {
  return NodeRepo.getParentId({ id })
}

async function getChildIndex({ id, childId }: { id: string; childId: string }) {
  const isExist = await NodeRepo.isNodeExist({ id })

  if (!isExist) {
    throw new Error('Node not found')
  }

  const childIds = await NodeRepo.getChildIds({ id })
  return childIds.indexOf(childId) + 1
}

async function removeChildIdFromParentNode({ id }: { id: string }) {
  const isExist = await NodeRepo.isNodeExist({ id })

  if (!isExist) {
    throw new Error('Node not found')
  }

  const parentId = await NodeRepo.getParentId({ id })
  if (!parentId) {
    return
  }

  const childIds = await NodeRepo.getChildIds({ id: parentId })
  const newChildIds = childIds.filter((childId) => childId !== id)
  await NodeRepo.updateChildIds({ id: parentId, childIds: newChildIds })
}

async function insertChildId({
  parentId,
  id,
  index,
}: {
  parentId: string
  id: string
  index: number
}) {
  const [isExistParent, isExist] = await Promise.all([
    NodeRepo.isNodeExist({ id: parentId }),
    NodeRepo.isNodeExist({ id }),
  ])

  if (!isExistParent) {
    throw new Error('Parent node not found')
  }

  if (!isExist) {
    throw new Error('Node not found')
  }

  const childIds = await NodeRepo.getChildIds({ id: parentId })
  const newChildIds = [
    ...childIds.slice(0, index),
    id,
    ...childIds.slice(index),
  ]
  await NodeRepo.updateChildIds({ id: parentId, childIds: newChildIds })
}

async function updateParentId({
  id,
  parentId,
}: {
  id: string
  parentId: string
}) {
  return NodeRepo.updateParentId({ id, parentId })
}

const NodeModel = {
  addNode,
  getNodeById,
  initialize,
  sync,
  updateNodeTitle,
  isExist,
  getParentId,
  getChildIndex,
  removeChildIdFromParentNode,
  insertChildId,
  updateParentId,
}

export default NodeModel
