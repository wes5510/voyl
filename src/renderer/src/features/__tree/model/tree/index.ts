import {
  createNewNode,
  decrementDepth,
  incrementDepth,
  NodeEntity,
  updateCollapsed,
  updateDepth,
  updateDepthByDelta,
  updateTitle,
} from './node'

export interface TreeEntity {
  nodeIds: string[]
  focusedNodeId?: string
  nodeMap: Map<NodeEntity['id'], NodeEntity>
}

export const isFocused = ({ entity, nodeId }: { entity: TreeEntity; nodeId: string }): boolean =>
  entity.focusedNodeId === nodeId

export const setFocusedNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: string
}): TreeEntity => ({
  ...entity,
  focusedNodeId: nodeId,
})

export const insertNewNodeAfter = ({
  entity,
  refNodeId,
  newNodeTitle,
}: {
  entity: TreeEntity
  refNodeId: NodeEntity['id']
  newNodeTitle: string
}): TreeEntity => {
  const refNode = entity.nodeMap.get(refNodeId)
  if (!refNode) {
    throw new Error('refNode not found')
  }

  const newNode = createNewNode({
    depth: __getDepthByNode({
      node: refNode,
    }),
    title: newNodeTitle,
  })

  return {
    nodeIds: __insertAfter({
      nodeIds: entity.nodeIds,
      refNodeId: refNode.id,
      targetNodeId: newNode.id,
    }),
    nodeMap: new Map([...Array.from(entity.nodeMap), [newNode.id, newNode]]),
    focusedNodeId: newNode.id,
  }
}

const __getDepthByNode = ({ node }: { node: NodeEntity }): number =>
  node.collapsed ? node.depth : node.depth + 1

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

export const updateFocusToNextNode = ({ entity }: { entity: TreeEntity }): TreeEntity => {
  const nextNodeId = __getNextNodeId({
    entity,
    nodeId: entity.focusedNodeId,
  })

  return {
    ...entity,
    focusedNodeId: nextNodeId,
  }
}

const __getNextNodeId = ({
  entity: { nodeIds },
  nodeId,
}: {
  entity: TreeEntity
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

export const updateFocusToPrevNode = ({ entity }: { entity: TreeEntity }): TreeEntity => {
  const prevNodeId = __getPrevNodeId({
    entity,
    nodeId: entity.focusedNodeId,
  })

  return {
    ...entity,
    focusedNodeId: prevNodeId ?? entity.focusedNodeId,
  }
}

const __getPrevNodeId = ({
  entity: { nodeIds },
  nodeId,
}: {
  entity: TreeEntity
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

export const removeNode = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: string
}): TreeEntity => {
  return __removeNode({
    entity: updateFocusToPrevNode({ entity }),
    nodeId,
  })
}

const __removeNode = ({ entity, nodeId }: { entity: TreeEntity; nodeId: string }): TreeEntity => ({
  ...entity,
  nodeIds: entity.nodeIds.filter((id) => id !== nodeId),
  nodeMap: new Map(Array.from(entity.nodeMap).filter(([id]) => id !== nodeId)),
})

export const indentNode = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: string
}): TreeEntity => {
  const targetNode = entity.nodeMap.get(nodeId)
  if (!targetNode) {
    return entity
  }

  const prevSiblingNode = __getPrevSiblingNode({ entity, targetNode })
  if (!prevSiblingNode) {
    return entity
  }

  return {
    ...entity,
    nodeMap: new Map([
      ...Array.from(entity.nodeMap),
      [targetNode.id, incrementDepth({ node: targetNode })],
      [prevSiblingNode.id, updateCollapsed({ node: prevSiblingNode, collapsed: false })],
      ...__incrementChildNodesDepth({ parentNode: targetNode, entity }).map(
        (node) => [node.id, node] as [string, NodeEntity],
      ),
    ]),
  }
}

const __incrementChildNodesDepth = ({
  parentNode,
  entity,
}: {
  parentNode: NodeEntity
  entity: TreeEntity
}): NodeEntity[] =>
  __updateChildNodesDepth({
    parentNode,
    entity,
    depthDelta: 1,
  })

const __getPrevSiblingNode = ({
  entity,
  targetNode,
}: {
  entity: TreeEntity
  targetNode: NodeEntity
}): NodeEntity | undefined => {
  const targetNodeIdx = entity.nodeIds.indexOf(targetNode.id)
  if (targetNodeIdx < 0) {
    throw new Error('targetNode not found')
  }
  const parentNodeIdx = __getParentNodeIndex({ entity, targetNode })

  for (let i = targetNodeIdx - 1; i >= parentNodeIdx + 1; i--) {
    const __node = entity.nodeMap.get(entity.nodeIds[i])
    if (__node && __isSiblingNode({ refNode: __node, targetNode: targetNode })) {
      return __node
    }
  }

  return undefined
}

const __isSiblingNode = ({
  refNode,
  targetNode,
}: {
  refNode: NodeEntity
  targetNode: NodeEntity
}): boolean => refNode.depth === targetNode.depth

const __getParentNodeIndex = ({
  entity,
  targetNode,
}: {
  entity: TreeEntity
  targetNode: NodeEntity
}): number => {
  const parentNode = __getParentNode({ entity, targetNode })
  if (!parentNode) {
    return -1
  }

  return entity.nodeIds.indexOf(parentNode.id)
}

export const outdentNode = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: string
}): TreeEntity => {
  const targetNode = entity.nodeMap.get(nodeId)
  if (!targetNode) {
    return entity
  }

  if (!__hasParentNode({ entity, targetNode })) {
    return entity
  }

  return {
    ...entity,
    nodeIds: __moveBeforeNextLowerDepthNode({ entity, targetNode }),
    nodeMap: new Map([
      ...Array.from(entity.nodeMap),
      [targetNode.id, decrementDepth({ node: targetNode })],
      ...__decrementChildNodesDepth({ parentNode: targetNode, entity }).map(
        (node) => [node.id, node] as [string, NodeEntity],
      ),
    ]),
  }
}

const __moveBeforeNextLowerDepthNode = ({
  entity,
  targetNode,
}: {
  entity: TreeEntity
  targetNode: NodeEntity
}): TreeEntity['nodeIds'] => {
  const targetNodeIdx = entity.nodeIds.indexOf(targetNode.id)
  if (targetNodeIdx < 0) {
    throw new Error('targetNode not found')
  }

  const nextLowerDepthNodeIdx = __getNextLowerDepthNodeIndx({ entity, targetNode })

  return nextLowerDepthNodeIdx === targetNodeIdx
    ? entity.nodeIds
    : __moveByIndex({
        entity,
        from: targetNodeIdx,
        to: nextLowerDepthNodeIdx - 1,
      })
}

const __moveByIndex = ({
  entity,
  from,
  to,
}: {
  entity: TreeEntity
  from: number
  to: number
}): TreeEntity['nodeIds'] => {
  const __new = [...entity.nodeIds]

  __new.splice(from, 1)
  __new.splice(to, 0, entity.nodeIds[from])

  return __new
}

const __getNextLowerDepthNodeIndx = ({
  entity,
  targetNode,
}: {
  entity: TreeEntity
  targetNode: NodeEntity
}): number => {
  const targetNodeIdx = entity.nodeIds.indexOf(targetNode.id)
  if (targetNodeIdx < 0) {
    throw new Error('targetNode not found')
  }

  for (let i = targetNodeIdx + 1; i < entity.nodeIds.length; i++) {
    if (
      __hasLowerDepth({
        comparedNode: entity.nodeMap.get(entity.nodeIds[i]),
        baseNode: targetNode,
      })
    ) {
      return i
    }
  }

  return entity.nodeIds.length
}

const __hasLowerDepth = ({
  comparedNode,
  baseNode,
}: {
  comparedNode: NodeEntity
  baseNode: NodeEntity
}): boolean => comparedNode.depth < baseNode.depth

const __decrementChildNodesDepth = ({
  parentNode,
  entity,
}: {
  parentNode: NodeEntity
  entity: TreeEntity
}): NodeEntity[] =>
  __updateChildNodesDepth({
    parentNode,
    entity,
    depthDelta: -1,
  })

const __updateChildNodesDepth = ({
  parentNode,
  entity,
  depthDelta,
}: {
  parentNode: NodeEntity
  entity: TreeEntity
  depthDelta: number
}): NodeEntity[] => {
  const childNodes = __getChildNodes({ entity, parentNode })
  return childNodes.map((node) => updateDepthByDelta({ node, depthDelta }))
}

const __getChildNodes = ({
  entity,
  parentNode,
}: {
  entity: TreeEntity
  parentNode: NodeEntity
}): NodeEntity[] => {
  const parentNodeIdx = entity.nodeIds.indexOf(parentNode.id)
  if (parentNodeIdx < 0) {
    throw new Error('parentNode not found')
  }

  const slicedNodes = entity.nodeIds.slice(parentNodeIdx + 1)
  const childNodes: NodeEntity[] = []

  for (const nodeId of slicedNodes) {
    const node = entity.nodeMap.get(nodeId)
    if (!node) {
      continue
    }

    if (!__isChildNode({ parentNode, childNode: node })) break
    childNodes.push(node)
  }

  return childNodes
}

const __isChildNode = ({
  parentNode,
  childNode,
}: {
  parentNode: NodeEntity
  childNode: NodeEntity
}): boolean => parentNode.depth < childNode.depth

const __hasParentNode = ({
  entity,
  targetNode,
}: {
  entity: TreeEntity
  targetNode: NodeEntity
}): boolean => __getParentNode({ entity, targetNode }) !== undefined

const __getParentNode = ({
  entity: { nodeIds, nodeMap },
  targetNode,
}: {
  entity: TreeEntity
  targetNode: NodeEntity
}): NodeEntity | undefined => {
  const targetNodeIdx = nodeIds.indexOf(targetNode.id)
  if (targetNodeIdx < 0) {
    throw new Error('targetNode not found')
  }

  if (!__canHaveParentNode({ targetNode })) {
    return undefined
  }

  for (let i = targetNodeIdx - 1; i >= 0; i--) {
    const __node = nodeMap.get(nodeIds[i])
    if (__isParentNode({ refNode: __node, targetNode: targetNode })) {
      return __node
    }
  }

  return undefined
}

const __canHaveParentNode = ({ targetNode }: { targetNode: NodeEntity }): boolean =>
  targetNode.depth >= 1

const __isParentNode = ({
  refNode,
  targetNode,
}: {
  refNode: NodeEntity
  targetNode: NodeEntity
}): boolean => refNode.depth === targetNode.depth - 1

const __getValidDepth = ({
  entity,
  refNode,
  targetNode,
  deltaDepth,
}: {
  entity: TreeEntity
  refNode: NodeEntity
  targetNode: NodeEntity
  deltaDepth: number
}): number => {
  const depth = targetNode.depth + deltaDepth
  const maxDepth = __getMaxDepth({ entity, nodeId: refNode.id })
  const minDepth = __getMinDepth({ entity, nodeId: refNode.id })

  if (depth >= maxDepth) {
    return maxDepth
  } else if (depth < minDepth) {
    return minDepth
  }
  return depth
}

const __getMaxDepth = ({ entity, nodeId }: { entity: TreeEntity; nodeId: string }): number => {
  const prevNode = __getPrevNode({ entity, nodeId })
  return prevNode ? prevNode.depth + 1 : 0
}

const __getPrevNode = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId?: string
}): NodeEntity | undefined => {
  if (!nodeId) {
    return
  }

  const idx = entity.nodeIds.findIndex((id) => id === nodeId)
  if (idx <= 0) {
    return
  }

  return entity.nodeMap.get(entity.nodeIds[idx - 1])
}

const __getMinDepth = ({ entity, nodeId }: { entity: TreeEntity; nodeId: string }): number => {
  const nextNode = __getNextNode({ entity, nodeId })
  return nextNode ? nextNode.depth : 0
}

const __getNextNode = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId?: string
}): NodeEntity | undefined => {
  const idx = entity.nodeIds.findIndex((id) => id === nodeId)
  if (idx < 0 || idx === entity.nodeIds.length - 1) {
    return
  }

  return entity.nodeMap.get(entity.nodeIds[idx + 1])
}

export const moveNode = ({
  entity,
  refNodeId,
  targetNodeId,
  deltaDepth,
}: {
  entity: TreeEntity
  refNodeId: string
  targetNodeId: string
  deltaDepth: number
}): TreeEntity => {
  const targetNode = entity.nodeMap.get(targetNodeId)
  if (!targetNode) {
    return entity
  }

  return {
    ...entity,
    nodeIds: __moveNodeIdsByRefNode({
      nodeIds: entity.nodeIds,
      refNodeId,
      targetNodeId,
    }),
    nodeMap: new Map([
      ...Array.from(entity.nodeMap),
      [
        targetNode.id,
        updateDepth({
          node: targetNode,
          depth: __getValidDepth({
            entity,
            refNode: targetNode,
            targetNode,
            deltaDepth,
          }),
        }),
      ],
    ]),
  }
}

const __moveNodeIdsByRefNode = ({
  nodeIds,
  refNodeId,
  targetNodeId,
}: {
  nodeIds: string[]
  refNodeId: string
  targetNodeId: string
}): string[] => {
  const refNodeIdx = nodeIds.indexOf(refNodeId)
  const targetNodeIdx = nodeIds.indexOf(targetNodeId)

  if (refNodeIdx < 0 || targetNodeIdx < 0) {
    throw new Error('refNode or targetNode not found')
  }

  return __moveIdsByIndex({
    nodeIds,
    from: refNodeIdx,
    to: targetNodeIdx,
  })
}

const __moveIdsByIndex = ({
  nodeIds,
  from,
  to,
}: {
  nodeIds: string[]
  from: number
  to: number
}): string[] => {
  const __new = [...nodeIds]

  __new.splice(from, 1)
  __new.splice(to, 0, nodeIds[from])

  return __new
}

export const getCollapsed = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: string
}): boolean => {
  const node = entity.nodeMap.get(nodeId)
  return node ? node.collapsed : false
}

export const setCollapsed = ({
  entity,
  nodeId,
  collapsed,
}: {
  entity: TreeEntity
  nodeId: string
  collapsed: boolean
}): TreeEntity => {
  return {
    ...entity,
    nodeMap: new Map([
      ...Array.from(entity.nodeMap),
      [nodeId, updateCollapsed({ node: entity.nodeMap.get(nodeId), collapsed })],
    ]),
    nodeIds: collapsed ? __removeChildNodeIds({ entity, nodeId }) : entity.nodeIds,
  }
}

const __removeChildNodeIds = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: string
}): string[] => {
  const parentNode = entity.nodeMap.get(nodeId)
  if (!parentNode) {
    return []
  }

  const childNodes: NodeEntity[] = __getChildNodes({ entity, parentNode })
  return entity.nodeIds.filter((nodeId) => !childNodes.some((node) => node.id === nodeId))
}

export const getNodeTitle = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: string
}): string => {
  const node = entity.nodeMap.get(nodeId)
  return node ? node.title : ''
}

export const setNodeTitle = ({
  entity,
  nodeId,
  title,
}: {
  entity: TreeEntity
  nodeId: string
  title: string
}): TreeEntity => {
  return {
    ...entity,
    nodeMap: new Map([
      ...Array.from(entity.nodeMap),
      [nodeId, updateTitle({ node: entity.nodeMap.get(nodeId), title })],
    ]),
  }
}

export const setNode = ({ entity, node }: { entity: TreeEntity; node: NodeEntity }): TreeEntity => {
  return {
    ...entity,
    nodeMap: new Map([...Array.from(entity.nodeMap), [node.id, node]]),
  }
}

export const getNodeDepth = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: string
}): number => {
  const node = entity.nodeMap.get(nodeId)
  return node ? node.depth : 0
}
