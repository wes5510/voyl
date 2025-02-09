export interface TreeViewEntity {
  rootNodeId: string
  focusedNodeId: string
  visibleNodeIds: string[]
}

export const setFocusedNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeViewEntity
  nodeId: string
}): TreeViewEntity => ({
  ...entity,
  focusedNodeId: nodeId,
})

export const setFocusToNextNode = ({ entity }: { entity: TreeViewEntity }): TreeViewEntity => {
  const nextNodeId = __getNextNodeId({
    entity,
    nodeId: entity.focusedNodeId,
  })

  if (!nextNodeId) {
    return entity
  }

  return setFocusedNodeId({ entity, nodeId: nextNodeId })
}

const __getNextNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeViewEntity
  nodeId: string
}): string | undefined => {
  const idx = entity.visibleNodeIds.findIndex((id) => id === nodeId)
  if (idx < 0 || idx === entity.visibleNodeIds.length - 1) {
    return
  }

  return entity.visibleNodeIds[idx + 1]
}

export const setFocusToPrevNode = ({ entity }: { entity: TreeViewEntity }): TreeViewEntity => {
  const prevNodeId = __getPrevNodeId({
    entity,
    nodeId: entity.focusedNodeId,
  })

  if (!prevNodeId) {
    return entity
  }

  return setFocusedNodeId({ entity, nodeId: prevNodeId })
}

const __getPrevNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeViewEntity
  nodeId: string
}): string | undefined => {
  const idx = entity.visibleNodeIds.findIndex((id) => id === nodeId)
  if (idx <= 0) {
    return
  }

  return entity.visibleNodeIds[idx - 1]
}

export const insertNewNodeAfter = ({
  entity,
  refNodeId,
  newNodeId,
}: {
  entity: TreeViewEntity
  refNodeId: string
  newNodeId: string
}): TreeViewEntity => {
  return __insertAfter({
    entity: setFocusedNodeId({ entity, nodeId: newNodeId }),
    refNodeId,
    targetNodeId: newNodeId,
  })
}

const __insertAfter = ({
  entity,
  refNodeId,
  targetNodeId,
}: {
  entity: TreeViewEntity
  refNodeId: string
  targetNodeId: string
}): TreeViewEntity => {
  const newVisibleNodeIds = [...entity.visibleNodeIds]
  const refIdx = newVisibleNodeIds.findIndex((id) => id === refNodeId)
  if (refIdx < 0) {
    throw new Error('refNodeId not found')
  }

  return {
    ...entity,
    visibleNodeIds: newVisibleNodeIds.splice(refIdx + 1, 0, targetNodeId),
  }
}

export const removeNode = ({
  entity,
  nodeId,
}: {
  entity: TreeViewEntity
  nodeId: string
}): TreeViewEntity => {
  return __removeNode({
    entity: setFocusToPrevNode({ entity }),
    nodeId,
  })
}

const __removeNode = ({
  entity,
  nodeId,
}: {
  entity: TreeViewEntity
  nodeId: string
}): TreeViewEntity => {
  return {
    ...entity,
    visibleNodeIds: entity.visibleNodeIds.filter((id) => id !== nodeId),
  }
}

export const moveNode = ({
  entity,
  refNodeId,
  targetNodeId,
}: {
  entity: TreeViewEntity
  refNodeId: string
  targetNodeId: string
}): TreeViewEntity => {
  return __moveNodeIdsByRefNode({
    entity: setFocusedNodeId({ entity, nodeId: targetNodeId }),
    refNodeId,
    targetNodeId,
  })
}

const __moveNodeIdsByRefNode = ({
  entity,
  refNodeId,
  targetNodeId,
}: {
  entity: TreeViewEntity
  refNodeId: string
  targetNodeId: string
}): TreeViewEntity => {
  const newVisibleNodeIds = [...entity.visibleNodeIds]
  const refNodeIdx = newVisibleNodeIds.indexOf(refNodeId)
  const targetNodeIdx = newVisibleNodeIds.indexOf(targetNodeId)

  if (refNodeIdx < 0 || targetNodeIdx < 0) {
    throw new Error('refNode or targetNode not found')
  }

  return __moveIdsByIndex({
    entity,
    from: refNodeIdx,
    to: targetNodeIdx,
  })
}

const __moveIdsByIndex = ({
  entity,
  from,
  to,
}: {
  entity: TreeViewEntity
  from: number
  to: number
}): TreeViewEntity => {
  const newVisibleNodeIds = [...entity.visibleNodeIds]

  newVisibleNodeIds.splice(from, 1)
  newVisibleNodeIds.splice(to, 0, newVisibleNodeIds[from])

  return {
    ...entity,
    visibleNodeIds: newVisibleNodeIds,
  }
}
