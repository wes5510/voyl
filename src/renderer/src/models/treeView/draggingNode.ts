import { NodeEntityId } from '../tree/node'
import {
  FlattenedTreeEntity,
  getDepth,
  getFlattenedTreeNode,
  getNextNode,
  getPrevNode,
  moveNode,
} from './flattenedTree'

export interface DraggingNodeEntity {
  id: string
  prevExpanded: boolean
  depth: number
}

export const setDraggingNodeByNodeId = ({
  entity,
  nodeId,
  flattenedTree,
}: {
  entity?: DraggingNodeEntity
  nodeId?: NodeEntityId
  flattenedTree: FlattenedTreeEntity
}) => {
  if (!nodeId) {
    return undefined
  }

  const node = getFlattenedTreeNode({ entity: flattenedTree, nodeId })

  return node
    ? {
        ...entity,
        id: node.id,
        depth: node.depth,
        prevExpanded: node.expanded,
      }
    : undefined
}

export const moveDraggingNodeByDeltaDepthAndOverNodeId = ({
  entity,
  overNodeId,
  deltaDepth,
  flattenedTree,
}: {
  entity: DraggingNodeEntity
  overNodeId: string
  deltaDepth: number
  flattenedTree: FlattenedTreeEntity
}): DraggingNodeEntity | undefined => {
  const originNodeDepth = getDepth({ entity: flattenedTree, nodeId: entity.id })

  if (originNodeDepth === undefined) {
    return undefined
  }

  return {
    ...entity,
    depth: __getDepth({
      overNodeId,
      draggingNodeId: entity.id,
      depth: originNodeDepth + deltaDepth,
      flattenedTree,
    }),
  }
}

const __getDepth = ({
  overNodeId,
  draggingNodeId,
  depth,
  flattenedTree,
}: {
  overNodeId: NodeEntityId
  draggingNodeId: NodeEntityId
  depth: number
  flattenedTree: FlattenedTreeEntity
}): number => {
  const { max, min } = __getMaxMinDepth({
    overNodeId,
    draggingNodeId,
    flattenedTree,
  })

  if (depth >= max) {
    return max
  } else if (depth < min) {
    return min
  }

  return depth
}

const __getMaxMinDepth = ({
  overNodeId,
  draggingNodeId,
  flattenedTree,
}: {
  overNodeId: NodeEntityId
  draggingNodeId: NodeEntityId
  flattenedTree: FlattenedTreeEntity
}) => {
  const movedFlattenedTree = moveNode({
    entity: flattenedTree,
    id: { from: draggingNodeId, to: overNodeId },
  })

  return {
    max: __getMaxDepth({ nodeId: draggingNodeId, flattenedTree: movedFlattenedTree }),
    min: __getMinDepth({ nodeId: draggingNodeId, flattenedTree: movedFlattenedTree }),
  }
}

const __getMaxDepth = ({
  nodeId,
  flattenedTree,
}: {
  nodeId: NodeEntityId
  flattenedTree: FlattenedTreeEntity
}): number => {
  const overNodePrevNode = getPrevNode({ entity: flattenedTree, nodeId })
  return overNodePrevNode ? overNodePrevNode.depth + 1 : 0
}

const __getMinDepth = ({
  nodeId,
  flattenedTree,
}: {
  nodeId: NodeEntityId
  flattenedTree: FlattenedTreeEntity
}): number => {
  const overNodeNextNode = getNextNode({ entity: flattenedTree, nodeId })
  return overNodeNextNode ? overNodeNextNode.depth : 0
}
