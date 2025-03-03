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
  const childNodeIds = __getChildNodeIdsByNodeId({ nodeTable, nodeId: entity.rootNodeId })

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
            ? __getChildNodeIdsByNodeId({ nodeTable, nodeId: node.id })
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

const __getChildNodeIdsByNodeId = ({
  nodeTable,
  nodeId,
}: {
  nodeTable: NodeTable
  nodeId: NodeEntityId
}): NodeEntityId[] => {
  return getChildNodeIdsByNodeId({ entity: { nodeTable, rootNodeId: '' }, nodeId })
}

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
  nodeTable,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
  nodeTable: NodeTable
}): FlattenedTreeEntity => {
  return __isExpanded({ nodeId, expandedNodeIds: entity.expandedNodeIds })
    ? __collapse({ entity, nodeId, nodeTable })
    : expand({ entity, nodeId, nodeTable })
}

export const setExpandedNodeIds = ({
  entity,
  expandedNodeIds,
  nodeTable,
}: {
  entity: FlattenedTreeEntity
  expandedNodeIds: string[]
  nodeTable: NodeTable
}): FlattenedTreeEntity => {
  const __newEntity = {
    ...entity,
    expandedNodeIds,
  }

  return __generateNodes({ entity: __newEntity, nodeTable })
}

const __collapse = ({
  entity,
  nodeId,
  nodeTable,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
  nodeTable: NodeTable
}): FlattenedTreeEntity => {
  return setExpandedNodeIds({
    entity,
    expandedNodeIds: entity.expandedNodeIds.filter((id) => id !== nodeId),
    nodeTable,
  })
}

export const expand = ({
  entity,
  nodeId,
  nodeTable,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
  nodeTable: NodeTable
}): FlattenedTreeEntity => {
  return setExpandedNodeIds({
    entity,
    expandedNodeIds: [...entity.expandedNodeIds, nodeId],
    nodeTable,
  })
}

export const isExpanded = ({
  entity,
  nodeId,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
}): boolean => __isExpanded({ nodeId, expandedNodeIds: entity.expandedNodeIds })
