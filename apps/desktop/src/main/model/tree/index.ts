import * as db from '../../db/node/index.js'
import NodeModel from '../node/index.js'
import { ROOT_NODE } from './const.js'

async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  await NodeModel.initialize({ workspaceDirPath })
  await NodeModel.addNode(ROOT_NODE)
}

function getRootNodeId() {
  return ROOT_NODE.id
}

async function getNode({ nodeId }: { nodeId: string }): Promise<{
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

async function getChildNodeIds({
  parentId,
}: {
  parentId: string
}): Promise<string[]> {
  if (parentId === '') {
    throw new Error('Parent ID cannot be empty string')
  }

  const childIds = await db.getChildIds({ parentId })
  return childIds
}

async function getNodeIndex({
  nodeId,
}: {
  nodeId: string
}): Promise<string | undefined> {
  if (nodeId === '') {
    throw new Error('Node ID cannot be empty string')
  }

  const index = await db.getNodeIndexById({ id: nodeId })
  return index
}

const TreeModel = {
  initialize,
  getRootNodeId,
  getNode,
  getChildNodeIds,
  getNodeIndex,
}
export default TreeModel
