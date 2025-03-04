import { NodeEntityId } from '../tree/node'
import {
  FlattenedTreeEntity,
  getFlattenedTreeNode,
  getNextNode,
  getPrevNode,
} from './flattenedTree'

export interface DraggingNodeEntity {
  id: string
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
  const originNode = getFlattenedTreeNode({ entity: flattenedTree, nodeId: entity.id })

  if (!originNode) {
    return undefined
  }

  return {
    ...entity,
    depth: __getValidDepth({
      originNodeDepth: originNode.depth,
      overNodeId,
      deltaDepth,
      flattenedTree,
    }),
  }
}

const __getValidDepth = ({
  originNodeDepth,
  overNodeId,
  deltaDepth,
  flattenedTree,
}: {
  originNodeDepth: number
  overNodeId: NodeEntityId
  deltaDepth: number
  flattenedTree: FlattenedTreeEntity
}): number => {
  const depth = originNodeDepth + deltaDepth
  const maxDepth = __getMaxDepth({ overNodeId, flattenedTree })
  const minDepth = __getMinDepth({ overNodeId, flattenedTree })

  if (depth >= maxDepth) {
    return maxDepth
  } else if (depth < minDepth) {
    return minDepth
  }

  return depth
}

const __getMaxDepth = ({
  overNodeId,
  flattenedTree,
}: {
  overNodeId: NodeEntityId
  flattenedTree: FlattenedTreeEntity
}): number => {
  const overNodePrevNode = getPrevNode({ entity: flattenedTree, nodeId: overNodeId })
  return overNodePrevNode ? overNodePrevNode.depth + 1 : 0
}

const __getMinDepth = ({
  overNodeId,
  flattenedTree,
}: {
  overNodeId: NodeEntityId
  flattenedTree: FlattenedTreeEntity
}): number => {
  const overNodeNextNode = getNextNode({ entity: flattenedTree, nodeId: overNodeId })
  return overNodeNextNode ? overNodeNextNode.depth : 0
}
