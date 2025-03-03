import { type NodeEntity } from '../tree/store'
import {
  expand,
  FlattenedTreeEntity,
  FlattenedTreeNode,
  initFlattenedTree,
  isExpanded,
  toggleExpanded,
} from './flattenedTree'

export interface TreeViewEntity {
  flattenedTree: FlattenedTreeEntity
  focusedNodeId?: string
  draggingNode?: DraggingNode
}

interface DraggingNode {
  id: string
  title: string
  depth: number
}

type NodeTable = Map<string, NodeEntity>

export const getTreeViewNodes = ({ entity }: { entity: TreeViewEntity }): FlattenedTreeNode[] => {
  return entity.flattenedTree.nodes
}

export const getDraggingNode = ({
  entity,
}: {
  entity: TreeViewEntity
}): DraggingNode | undefined => {
  return entity.draggingNode
}

export const setRootNodeId = ({
  entity,
  nodeTable,
  rootNodeId,
}: {
  entity: TreeViewEntity
  nodeTable: NodeTable
  rootNodeId: string
}): TreeViewEntity => {
  return {
    ...entity,
    flattenedTree: initFlattenedTree({ entity: entity.flattenedTree, rootNodeId, nodeTable }),
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
