import {
  DraggingNodeEntity,
  setDraggingNodeByNodeId,
  moveDraggingNodeByDeltaDepthAndOverNodeId,
} from './draggingNode'
import {
  collapse,
  expand,
  FlattenedTreeEntity,
  FlattenedTreeNode,
  getChildNodeIds,
  getFlattenedTreeNode,
  getParentNodeId,
  getPrevNode,
  getRootNodeId,
  initFlattenedTree,
  isExpanded,
  moveNode,
  NodeTable,
  sliceFlattenedTree,
  toggleExpanded,
} from './flattenedTree'

export interface TreeViewEntity {
  flattenedTree: FlattenedTreeEntity
  focusedNodeId?: string
  draggingNode?: DraggingNodeEntity
  topNodeId?: string
}

export const getTreeViewNodes = ({ entity }: { entity: TreeViewEntity }): FlattenedTreeNode[] => {
  return entity.flattenedTree.nodes
}

export const setTopNodeId = ({
  entity,
  topNodeId,
}: {
  entity: TreeViewEntity
  topNodeId: string
}): TreeViewEntity => {
  return {
    ...entity,
    topNodeId,
  }
}

export const setFocusedNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeViewEntity
  nodeId: string | undefined
}): TreeViewEntity => {
  return {
    ...entity,
    focusedNodeId: nodeId,
  }
}

export const isFocus = ({ entity, nodeId }: { entity: TreeViewEntity; nodeId: string }): boolean =>
  entity.focusedNodeId === nodeId

export const setFocusToPrevNode = ({ entity }: { entity: TreeViewEntity }): TreeViewEntity => {
  return setFocusedNodeId({
    entity,
    nodeId: __getPrevNodeId({ entity, nodeId: entity.focusedNodeId }),
  })
}

const __getPrevNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeViewEntity
  nodeId?: string
}): string | undefined => {
  if (!nodeId) {
    return
  }

  const idx = entity.flattenedTree.nodes.findIndex((node) => node.id === nodeId)
  if (idx <= 0) {
    return
  }

  return entity.flattenedTree.nodes[idx - 1].id
}

export const setFocusToNextNode = ({ entity }: { entity: TreeViewEntity }): TreeViewEntity => {
  return setFocusedNodeId({
    entity,
    nodeId: __getNextNodeId({ entity, nodeId: entity.focusedNodeId }),
  })
}

const __getNextNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeViewEntity
  nodeId?: string
}): string | undefined => {
  if (!nodeId) {
    return
  }

  const idx = entity.flattenedTree.nodes.findIndex((node) => node.id === nodeId)
  if (idx < 0 || idx === entity.flattenedTree.nodes.length - 1) {
    return
  }

  return entity.flattenedTree.nodes[idx + 1].id
}

export const setFocusForRemovedNode = ({
  entity,
  nodeId,
}: {
  entity: TreeViewEntity
  nodeId: string
}) => {
  const hasPrevSiblingNode = __hasPrevNode({ entity, nodeId })

  return setFocusedNodeId({
    entity,
    nodeId: hasPrevSiblingNode
      ? __getPrevNodeId({ entity, nodeId })
      : __getNextNodeId({ entity, nodeId }),
  })
}

const __hasPrevNode = ({ entity, nodeId }: { entity: TreeViewEntity; nodeId: string }) => {
  const idx = entity.flattenedTree.nodes.findIndex((node) => node.id === nodeId)
  return idx > 0
}

export const toggleExpandedNode = ({
  entity,
  nodeId,
  nodeTable,
}: {
  entity: TreeViewEntity
  nodeId: string
  nodeTable: NodeTable
}) => {
  return {
    ...entity,
    flattenedTree: toggleExpanded({ entity: entity.flattenedTree, nodeId, nodeTable }),
  }
}

export const expandNode = ({
  entity,
  nodeId,
  nodeTable,
}: {
  entity: TreeViewEntity
  nodeId: string
  nodeTable: NodeTable
}) => {
  return {
    ...entity,
    flattenedTree: expand({ entity: entity.flattenedTree, nodeId, nodeTable }),
  }
}

export const isExpandedNode = ({ entity, nodeId }: { entity: TreeViewEntity; nodeId: string }) =>
  isExpanded({ entity: entity.flattenedTree, nodeId })

export const getDraggingNode = ({
  entity,
}: {
  entity: TreeViewEntity
}): DraggingNodeEntity | undefined => {
  return entity.draggingNode
}

export const setDraggingNode = ({
  entity,
  nodeId,
  nodeTable,
}: {
  entity: TreeViewEntity
  nodeId?: string
  nodeTable: NodeTable
}) => {
  return {
    ...entity,
    flattenedTree: nodeId
      ? collapse({
          entity: entity.flattenedTree,
          nodeId,
          nodeTable,
        })
      : entity.flattenedTree,
    draggingNode: setDraggingNodeByNodeId({
      entity: entity.draggingNode,
      nodeId,
      flattenedTree: entity.flattenedTree,
    }),
  }
}

export const moveDraggingNode = ({
  entity,
  overNodeId,
  deltaDepth,
}: {
  entity: TreeViewEntity
  overNodeId: string
  deltaDepth: number
}) => {
  const draggingNode = entity.draggingNode
  if (!draggingNode) {
    return entity
  }

  return {
    ...entity,
    draggingNode: moveDraggingNodeByDeltaDepthAndOverNodeId({
      entity: draggingNode,
      overNodeId,
      deltaDepth,
      flattenedTree: entity.flattenedTree,
    }),
  }
}

export const getNodeDepth = ({ entity, nodeId }: { entity: TreeViewEntity; nodeId: string }) => {
  const node = getFlattenedTreeNode({ entity: entity.flattenedTree, nodeId })
  return node?.depth ?? 0
}

export const getDraggingNodeParentId = ({
  entity,
  overNodeId,
}: {
  entity: TreeViewEntity
  overNodeId: string
}) => {
  const { draggingNode } = entity
  if (!draggingNode) {
    return
  }

  const movedFlattenedTree = moveNode({
    entity: entity.flattenedTree,
    id: { from: draggingNode.id, to: overNodeId },
  })
  const overNodePrev = getPrevNode({
    entity: movedFlattenedTree,
    nodeId: draggingNode.id,
  })
  const rootNodeId = getRootNodeId({ entity: movedFlattenedTree })

  if (draggingNode.depth === 0 || !overNodePrev) {
    return rootNodeId
  }

  if (draggingNode.depth === overNodePrev.depth) {
    return getParentNodeId({ entity: movedFlattenedTree, nodeId: overNodePrev.id })
  }

  if (draggingNode.depth > overNodePrev.depth) {
    return overNodePrev.id
  }

  const siblingNode = sliceFlattenedTree({ entity: movedFlattenedTree, endNodeId: draggingNode.id })
    .reverse()
    .find((item) => item.depth === draggingNode.depth)

  if (!siblingNode) {
    return rootNodeId
  }

  const newParentNodeId = getParentNodeId({
    entity: movedFlattenedTree,
    nodeId: siblingNode.id,
  })

  return newParentNodeId ?? rootNodeId
}

export const getCountChildBetweenNodes = ({
  entity,
  parentNodeId,
  nodeId,
}: {
  entity: TreeViewEntity
  parentNodeId: string
  nodeId: string
}) => {
  const childNodes = getChildNodeIds({ entity: entity.flattenedTree, nodeId: parentNodeId })

  if (!childNodes || childNodes.length === 0) {
    return 0
  }

  const nodesUnderParent = sliceFlattenedTree({
    entity: entity.flattenedTree,
    startNodeId: parentNodeId,
    endNodeId: nodeId,
  })

  const count = nodesUnderParent.reduce(
    (acc, node) => (childNodes.includes(node.id) ? acc + 1 : acc),
    0,
  )

  return count
}

export const resetDraggingNode = ({
  entity,
  nodeTable,
}: {
  entity: TreeViewEntity
  nodeTable: NodeTable
}) => {
  const { draggingNode } = entity

  return draggingNode
    ? {
        ...entity,
        flattenedTree: draggingNode.prevExpanded
          ? expand({
              entity: entity.flattenedTree,
              nodeId: draggingNode.id,
              nodeTable,
            })
          : entity.flattenedTree,
        draggingNode: undefined,
      }
    : entity
}
