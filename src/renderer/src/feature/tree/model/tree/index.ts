import { FocusManagerModel, isFocused, updateFocused } from './focusManager'
import {
  incrementDepth,
  createNode,
  getDepthByPrevSibling,
  getNextNodeId,
  getPrevNodeId,
  NodeModel,
  updateCollapsed,
} from './node'

export interface TreeModel {
  nodeIds: string[]
  nodeTable: Map<NodeModel['id'], NodeModel>
  focusManager: FocusManagerModel
}

export const setNodeIds = ({
  tree,
  nodeIds,
}: {
  tree: TreeModel
  nodeIds: string[]
}): TreeModel => {
  return { ...tree, nodeIds }
}

export const isFocusedNode = ({
  focusedNodeId,
  nodeId,
}: {
  focusedNodeId?: string
  nodeId: string
}): boolean => isFocused({ focusedNodeId, nodeId })

export const insertNewNodeAfter = ({
  nodeIds,
  nodeTable,
  refNodeId,
  newTitle,
}: {
  nodeIds: string[]
  nodeTable: Map<string, NodeModel>
  refNodeId: string
  newTitle: string
}): TreeModel => {
  const refNode = nodeTable.get(refNodeId)

  if (!refNode) {
    throw new Error('refNode not found')
  }

  const newNode = createNode({
    depth: getDepthByPrevSibling({
      prevSibling: refNode,
    }),
    thing: {
      title: newTitle,
    },
  })

  return {
    nodeIds: __insertAfter({
      nodeIds,
      refNodeId: refNode.id,
      targetNodeId: newNode.id,
    }),
    nodeTable: __setNodeTable({ nodeTable, node: newNode }),
    focusManager: updateFocused({ nodeId: newNode.id }),
  }
}

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

const __setNodeTable = ({
  nodeTable,
  node,
}: {
  nodeTable: Map<string, NodeModel>
  node: NodeModel
}): Map<string, NodeModel> => nodeTable.set(node.id, node)

export const updateFocusToNextNode = ({
  nodeIds,
  focusedNodeId,
}: {
  nodeIds: string[]
  focusedNodeId?: string
}): FocusManagerModel =>
  updateFocused({
    nodeId: getNextNodeId({ nodeIds, nodeId: focusedNodeId }),
  })

export const updateFocusToPrevNode = ({
  nodeIds,
  focusedNodeId,
}: {
  nodeIds: string[]
  focusedNodeId?: string
}): FocusManagerModel =>
  updateFocused({
    nodeId: getPrevNodeId({ nodeIds, nodeId: focusedNodeId }),
    fallbackNodeId: focusedNodeId,
  })

export const removeNode = ({
  nodeIds,
  nodeTable,
  nodeId,
}: {
  nodeIds: string[]
  nodeTable: Map<string, NodeModel>
  nodeId: string
}): TreeModel => {
  return {
    nodeIds: __removeNodeId({ nodeIds, nodeId }),
    nodeTable: __removeNodeTable({ nodeTable, nodeId }),
    focusManager: updateFocusToPrevNode({ nodeIds, focusedNodeId: nodeId }),
  }
}

const __removeNodeId = ({ nodeIds, nodeId }: { nodeIds: string[]; nodeId: string }): string[] =>
  nodeIds.filter((id) => id !== nodeId)

const __removeNodeTable = ({
  nodeTable,
  nodeId,
}: {
  nodeTable: Map<string, NodeModel>
  nodeId: string
}): Map<string, NodeModel> => {
  const __new = new Map(nodeTable)

  __new.delete(nodeId)

  return __new
}

export const indentNode = ({
  nodeTable,
  nodeId,
}: {
  nodeIds: string[]
  nodeTable: TreeModel['nodeTable']
  nodeId: string
}): TreeModel['nodeTable'] => {
  const targetNode = nodeTable.get(nodeId)
  if (!targetNode) {
    throw new Error('targetNode not found')
  }

  const __newTargetNode = incrementDepth({ node: targetNode })
  const __newPrevSiblingNode = updateCollapsed({
    node: __getPrevSiblingNode({ nodes, targetNode }),
    collapsed: false,
  })
  const __newChildNodes = incrementChildNodesDepth({
    parentNode: __newTargetNode,
  })
}
