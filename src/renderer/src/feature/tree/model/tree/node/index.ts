import { createThing, ThingModel } from './thing'
import { v4 as uuid } from 'uuid'

export interface NodeModel {
  id: string
  depth: number
  collapsed: boolean
  thing: ThingModel
}

export const createNode = ({
  depth,
  collapsed = true,
  thing,
}: {
  depth: number
  collapsed?: boolean
  thing: {
    title: string
    content?: string
  }
}): NodeModel => ({
  id: uuid(),
  depth,
  collapsed,
  thing: createThing(thing),
})

export const getDepthByPrevSibling = ({ prevSibling }: { prevSibling: NodeModel }): number =>
  prevSibling.collapsed ? prevSibling.depth : prevSibling.depth + 1

export const getNextNodeId = ({
  nodeIds,
  nodeId,
}: {
  nodeIds: string[]
  nodeId?: string
}): string | undefined => {
  if (!nodeId) {
    return
  }

  const idx = nodeIds.indexOf(nodeId)
  if (idx < 0 || idx === nodeIds.length - 1) {
    return
  }

  return nodeIds[idx + 1]
}

export const getPrevNodeId = ({
  nodeIds,
  nodeId,
}: {
  nodeIds: string[]
  nodeId?: string
}): string | undefined => {
  if (!nodeId) {
    return
  }

  const idx = nodeIds.indexOf(nodeId)
  if (idx <= 0) {
    return
  }

  return nodeIds[idx - 1]
}

export const incrementDepth = ({ node }: { node: NodeModel }): NodeModel =>
  updateDepthByDelta({ node, depthDelta: 1 })

export const updateDepthByDelta = ({
  node,
  depthDelta,
}: {
  node: NodeModel
  depthDelta: number
}): NodeModel =>
  updateDepth({
    node,
    depth: node.depth + depthDelta,
  })

export const updateDepth = ({ node, depth }: { node: NodeModel; depth: number }): NodeModel => ({
  ...node,
  depth,
})

export const updateCollapsed = ({
  node,
  collapsed,
}: {
  node: NodeModel
  collapsed: boolean
}): NodeModel => ({ ...node, collapsed })

export const getPrevSiblingNode = ({
  nodeIds,
  nodeTable,
  targetNode,
}: {
  nodeIds: string[]
  nodeTable: Map<string, NodeModel>
  targetNode: NodeModel
}): NodeModel | undefined => {
  const targetNodeIdx = nodeIds.indexOf(targetNode.id)
  if (targetNodeIdx < 0) {
    throw new Error('targetNode not found')
  }
  const parentNodeIdx = getParentNodeIndex({ nodes, targetNode })

  for (let i = targetNodeIdx - 1; i >= parentNodeIdx + 1; i--) {
    const __node = nodes[i]
    if (isSiblingNode({ refNode: __node, targetNode: targetNode })) {
      return __node
    }
  }

  return undefined
}

export const getParentNodeIndex = ({
  nodeIds,
  targetNode,
}: {
  nodeIds: string[]
  targetNode: NodeModel
}): number => {
  const targetNodeIdx = nodeIds.indexOf(targetNode.id)
  if (targetNodeIdx < 0) {
    throw new Error('targetNode not found')
  }

  return targetNodeIdx
}
