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
      childNodes: NodeModel[]
    }
  | undefined => {
  const prevSiblingNode = __getPrevSiblingNode({ nodes, targetNode })
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
      collapsed: false,
    },
    childNodes: __incrementChildNodesDepth({ parentNode: targetNode, nodes }),
  }
}

const __incrementChildNodesDepth = ({
  parentNode,
  nodes,
}: {
  parentNode: NodeModel
  nodes: NodeModel[]
}): NodeModel[] =>
  __updateChildNodesDepth({
    parentNode,
    nodes,
    depthDelta: 1,
  })

const __getPrevSiblingNode = ({
  nodes,
  targetNode,
}: {
  nodes: NodeModel[]
  targetNode: NodeModel
}): NodeModel | undefined => {
  const targetNodeIdx = nodes.indexOf(targetNode)
  if (targetNodeIdx < 0) {
    throw new Error('targetNode not found')
  }
  const parentNodeIdx = __getParentNodeIndex({ nodes, targetNode })

  for (let i = targetNodeIdx - 1; i >= parentNodeIdx + 1; i--) {
    const __node = nodes[i]
    if (__isSiblingNode({ refNode: __node, targetNode: targetNode })) {
      return __node
    }
  }

  return undefined
}

const __isSiblingNode = ({
  refNode,
  targetNode,
}: {
  refNode: NodeModel
  targetNode: NodeModel
}): boolean => refNode.depth === targetNode.depth

const __getParentNodeIndex = ({
  nodes,
  targetNode,
}: {
  nodes: NodeModel[]
  targetNode: NodeModel
}): number => {
  const parentNode = __getParentNode({ nodes, targetNode })
  if (!parentNode) {
    return -1
  }

  return nodes.indexOf(parentNode)
}

export const outdentNode = ({
  nodes,
  targetNode,
}: {
  nodes: NodeModel[]
  targetNode: NodeModel
}):
  | {
      targetNode: NodeModel
      childNodes: NodeModel[]
      nodeIds: string[]
    }
  | undefined => {
  if (!__hasParentNode({ nodes, targetNode })) {
    return undefined
  }

  return {
    targetNode: {
      ...targetNode,
      depth: targetNode.depth - 1,
    },
    childNodes: __decrementChildNodesDepth({ parentNode: targetNode, nodes }),
    nodeIds: __moveAfterLastSiblingNode({ nodes, targetNode }).map((node) => node.id),
  }
}

const __moveAfterLastSiblingNode = ({
  nodes,
  targetNode,
}: {
  nodes: NodeModel[]
  targetNode: NodeModel
}): NodeModel[] => {
  const targetNodeIdx = nodes.indexOf(targetNode)
  if (targetNodeIdx < 0) {
    throw new Error('targetNode not found')
  }

  const nextLowerDepthNodeIdx = __getNextLowerDepthNodeIndx({ nodes, targetNode })

  return nextLowerDepthNodeIdx === targetNodeIdx
    ? nodes
    : __moveByIndex({
        nodes,
        from: targetNodeIdx,
        to: nextLowerDepthNodeIdx - 1,
      })
}

const __moveByIndex = ({
  nodes,
  from,
  to,
}: {
  nodes: NodeModel[]
  from: number
  to: number
}): NodeModel[] => {
  const __new = [...nodes]

  __new.splice(from, 1)
  __new.splice(to, 0, nodes[from])

  return __new
}

const __getNextLowerDepthNodeIndx = ({
  nodes,
  targetNode,
}: {
  nodes: NodeModel[]
  targetNode: NodeModel
}): number => {
  const targetNodeIdx = nodes.indexOf(targetNode)
  if (targetNodeIdx < 0) {
    throw new Error('targetNode not found')
  }

  for (let i = targetNodeIdx + 1; i < nodes.length; i++) {
    const __node = nodes[i]
    if (__hasLowerDepth({ comparedNode: __node, baseNode: targetNode })) {
      return i
    }
  }

  return nodes.length
}

const __hasLowerDepth = ({
  comparedNode,
  baseNode,
}: {
  comparedNode: NodeModel
  baseNode: NodeModel
}): boolean => comparedNode.depth < baseNode.depth

const __decrementChildNodesDepth = ({
  parentNode,
  nodes,
}: {
  parentNode: NodeModel
  nodes: NodeModel[]
}): NodeModel[] =>
  __updateChildNodesDepth({
    parentNode,
    nodes,
    depthDelta: -1,
  })

const __updateChildNodesDepth = ({
  parentNode,
  nodes,
  depthDelta,
}: {
  parentNode: NodeModel
  nodes: NodeModel[]
  depthDelta: number
}): NodeModel[] => {
  const childNodes = __getChildNodes({ parentNode, nodes })
  return childNodes.map((node) => ({
    ...node,
    depth: node.depth + depthDelta,
  }))
}

const __getChildNodes = ({
  parentNode,
  nodes,
}: {
  parentNode: NodeModel
  nodes: NodeModel[]
}): NodeModel[] => {
  const parentNodeIdx = nodes.indexOf(parentNode)
  if (parentNodeIdx < 0) {
    throw new Error('parentNode not found')
  }

  const slicedNodes = nodes.slice(parentNodeIdx + 1)
  const childNodes: NodeModel[] = []

  for (const node of slicedNodes) {
    if (!__isChildNode({ parentNode, childNode: node })) break
    childNodes.push(node)
  }

  return childNodes
}

const __isChildNode = ({
  parentNode,
  childNode,
}: {
  parentNode: NodeModel
  childNode: NodeModel
}): boolean => parentNode.depth < childNode.depth

const __hasParentNode = ({
  nodes,
  targetNode,
}: {
  nodes: NodeModel[]
  targetNode: NodeModel
}): boolean => __getParentNode({ nodes, targetNode }) !== undefined

const __getParentNode = ({
  nodes,
  targetNode,
}: {
  nodes: NodeModel[]
  targetNode: NodeModel
}): NodeModel | undefined => {
  const targetNodeIdx = nodes.indexOf(targetNode)
  if (targetNodeIdx < 0) {
    throw new Error('targetNode not found')
  }

  if (!__canHaveParentNode({ targetNode })) {
    return undefined
  }

  for (let i = targetNodeIdx - 1; i >= 0; i--) {
    const __node = nodes[i]
    if (__isParentNode({ refNode: __node, targetNode: targetNode })) {
      return __node
    }
  }

  return undefined
}

const __canHaveParentNode = ({ targetNode }: { targetNode: NodeModel }): boolean =>
  targetNode.depth >= 1

const __isParentNode = ({
  refNode,
  targetNode,
}: {
  refNode: NodeModel
  targetNode: NodeModel
}): boolean => refNode.depth === targetNode.depth - 1
