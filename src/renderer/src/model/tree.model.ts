import { createNewNode, NodeModel } from './node.model'

export interface TreeModel {
  nodeIds: string[]
  focusedNodeId?: string
}

export const insertNewNodeAfter = ({
  nodeIds,
  refNode,
  newNodeTitle,
}: {
  nodeIds: string[]
  refNode: NodeModel
  newNodeTitle: string
}): {
  nodeIds: string[]
  focusedNodeId: string
  newNode: NodeModel
} => {
  const newNode = createNewNode({
    depth: getDepthByRefNode({
      collapsed: refNode.collapsed,
      depth: refNode.depth,
    }),
    title: newNodeTitle,
  })

  return {
    nodeIds: __insertAfter({
      nodeIds,
      refNodeId: refNode.id,
      targetNodeId: newNode.id,
    }),
    newNode,
    focusedNodeId: newNode.id,
  }
}

const getDepthByRefNode = ({ collapsed, depth }: { collapsed: boolean; depth: number }): number =>
  collapsed ? depth : depth + 1

const __insertAfter = ({
  nodeIds,
  refNodeId,
  targetNodeId,
}: {
  nodeIds: string[]
  refNodeId: string
  targetNodeId: string
}): string[] => {
  const __new = [...nodeIds]
  const refIdx = __new.indexOf(refNodeId)

  if (refIdx < 0) {
    throw new Error('refNodeId not found')
  }

  __new.splice(refIdx + 1, 0, targetNodeId)
  return __new
}

export const getNextNodeIdFromFocusedNodeId = (
  nodeIds: string[],
  focusedNodeId?: string,
): string | undefined => __getNextNodeId(nodeIds, focusedNodeId) ?? focusedNodeId

const __getNextNodeId = (nodeIds: string[], nodeId?: string): string | undefined => {
  if (!nodeId) {
    return
  }

  const idx = nodeIds.indexOf(nodeId)
  if (idx < 0 || idx === nodeIds.length - 1) {
    return
  }

  return nodeIds[idx + 1]
}

export const getPrevNodeIdFromFocusedNodeId = (
  nodeIds: string[],
  focusedNodeId?: string,
): string | undefined => __getPrevNodeId(nodeIds, focusedNodeId) ?? focusedNodeId

const __getPrevNodeId = (nodeIds: string[], nodeId?: string): string | undefined => {
  if (!nodeId) {
    return
  }

  const idx = nodeIds.indexOf(nodeId)
  if (idx <= 0) {
    return
  }

  return nodeIds[idx - 1]
}

export const removeNodeId = (nodeIds: string[], nodeId: string): string[] =>
  nodeIds.filter((id) => id !== nodeId)

export const indentNode = (
  nodes: NodeModel[],
  targetNode: NodeModel,
):
  | {
      prevSiblingNode: NodeModel
      targetNode: NodeModel
    }
  | undefined => {
  const prevSiblingNode = __getPrevSiblingNode(nodes, targetNode)
  if (!prevSiblingNode) {
    return undefined
  }

  return {
    targetNode: {
      ...targetNode,
      depth: targetNode.depth + 1,
    },
    prevSiblingNode: {
      ...prevSiblingNode,
      collapsed: true,
    },
  }
}

const __getPrevSiblingNode = (nodes: NodeModel[], targetNode: NodeModel): NodeModel | undefined => {
  const targetNodeIdx = nodes.indexOf(targetNode)

  if (targetNodeIdx < 0) {
    throw new Error('targetNode not found')
  }

  for (let i = targetNodeIdx - 1; i >= 0; i--) {
    const __node = nodes[i]
    if (__node.depth === targetNode.depth) {
      return __node
    }
  }

  return undefined
}
