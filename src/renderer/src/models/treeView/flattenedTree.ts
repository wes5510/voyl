import { getChildNodeIdsByNodeId, getNode, NodeEntity, NodeEntityId } from '../tree/store'

export type FlattenedTreeEntity = {
  nodes: FlattenedTreeNode[]
  expandedNodeIds: string[]
  rootNodeId: string
}

export interface FlattenedTreeNode {
  id: string
  depth: number
  expanded: boolean
  childNodeIds: string[]
}

type NodeTable = Map<NodeEntityId, NodeEntity>

export const initFlattenedTree = ({
  entity,
  rootNodeId,
  nodeTable,
}: {
  entity: FlattenedTreeEntity
  rootNodeId: NodeEntityId
  nodeTable: NodeTable
}): FlattenedTreeEntity => {
  const __new = {
    ...entity,
    rootNodeId,
  }

  return __generateNodes({ entity: __new, nodeTable })
}

const __generateNodes = ({
  entity,
  nodeTable,
}: {
  entity: FlattenedTreeEntity
  nodeTable: NodeTable
}): FlattenedTreeEntity => {
  const childNodeIds = getChildNodeIdsByNodeId({ entity: nodeTable, nodeId: entity.rootNodeId })

  return {
    ...entity,
    nodes: __flattenNodes({
      nodes: __childNodeIdsToTreeViewNodes({
        childNodeIds,
        expandedNodeIds: entity.expandedNodeIds,
        nodeTable,
        depth: 0,
      }),
      expandedNodeIds: entity.expandedNodeIds,
      nodeTable,
    }),
  }
}
const __flattenNodes = ({
  nodes,
  expandedNodeIds,
  nodeTable,
}: {
  nodes: FlattenedTreeNode[]
  expandedNodeIds: string[]
  nodeTable: NodeTable
}): FlattenedTreeNode[] =>
  nodes.reduce((acc, node): FlattenedTreeNode[] => {
    return [
      ...acc,
      node,
      ...__flattenNodes({
        nodes: __childNodeIdsToTreeViewNodes({
          childNodeIds: node.expanded
            ? getChildNodeIdsByNodeId({ entity: nodeTable, nodeId: node.id })
            : [],
          expandedNodeIds,
          nodeTable,
          depth: node.depth + 1,
        }),
        expandedNodeIds,
        nodeTable,
      }),
    ]
  }, [] as FlattenedTreeNode[])

const __childNodeIdsToTreeViewNodes = ({
  childNodeIds,
  nodeTable,
  expandedNodeIds,
  depth,
}: {
  childNodeIds: string[]
  nodeTable: NodeTable
  expandedNodeIds: string[]
  depth: number
}): FlattenedTreeNode[] => {
  return childNodeIds.map((id) =>
    __nodeToTreeViewNode({
      node: getNode({ entity: nodeTable, nodeId: id }),
      depth,
      expanded: __isExpanded({ nodeId: id, expandedNodeIds }),
    }),
  )
}

const __isExpanded = ({
  nodeId,
  expandedNodeIds,
}: {
  nodeId: string
  expandedNodeIds: string[]
}): boolean => expandedNodeIds.includes(nodeId)

const __nodeToTreeViewNode = ({
  node,
  depth,
  expanded,
}: {
  node?: NodeEntity
  depth: number
  expanded: boolean
}): FlattenedTreeNode => {
  if (!node) {
    throw new Error('Node is undefined')
  }

  return {
    id: node.id,
    depth,
    expanded,
    childNodeIds: Array.from(node.childNodeIds),
  }
}

export const toggleExpanded = ({
  entity,
  nodeId,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
}): FlattenedTreeEntity => {
  return __isExpanded({ nodeId, expandedNodeIds: entity.expandedNodeIds })
    ? __collapse({ entity, nodeId })
    : __expand({ entity, nodeId })
}

const __expand = ({
  entity,
  nodeId,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
}): FlattenedTreeEntity => {
  return {
    ...entity,
    expandedNodeIds: [...entity.expandedNodeIds, nodeId],
  }
}

const __collapse = ({
  entity,
  nodeId,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
}): FlattenedTreeEntity => {
  return {
    ...entity,
    expandedNodeIds: entity.expandedNodeIds.filter((id) => id !== nodeId),
  }
}

export const isExpanded = ({
  entity,
  nodeId,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
}): boolean => __isExpanded({ nodeId, expandedNodeIds: entity.expandedNodeIds })
