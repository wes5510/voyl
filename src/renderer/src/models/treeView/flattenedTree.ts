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

export const getFlattenedTreeNode = ({
  entity,
  nodeId,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
}) => {
  return entity.nodes.find((node) => node.id === nodeId)
}

export const getPrevNode = ({
  entity,
  nodeId,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
}) => {
  const idx = entity.nodes.findIndex((node) => node.id === nodeId)
  if (idx <= 0) {
    return undefined
  }

  return entity.nodes[idx - 1]
}

export const getNextNode = ({
  entity,
  nodeId,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
}) => {
  const idx = entity.nodes.findIndex((node) => node.id === nodeId)
  if (idx >= entity.nodes.length - 1) {
    return undefined
  }

  return entity.nodes[idx + 1]
}

export const getParentNodeId = ({
  entity,
  nodeId,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
}) => {
  const node = entity.nodes.find((node) => node.childNodeIds.includes(nodeId))
  return node?.id
}

export const getIndex = ({ entity, nodeId }: { entity: FlattenedTreeEntity; nodeId: string }) => {
  return entity.nodes.findIndex((node) => node.id === nodeId)
}

export const getRootNodeId = ({ entity }: { entity: FlattenedTreeEntity }) => {
  return entity.rootNodeId
}

export const sliceFlattenedTree = ({
  entity,
  startNodeId,
  endNodeId,
}: {
  entity: FlattenedTreeEntity
  startNodeId?: string
  endNodeId?: string
}) => {
  const startIndex = __getStartIndexForSlice({ entity, startNodeId })
  const endIndex = endNodeId ? getIndex({ entity, nodeId: endNodeId }) : entity.nodes.length

  return entity.nodes.slice(startIndex, endIndex)
}

const __getStartIndexForSlice = ({
  entity,
  startNodeId,
}: {
  entity: FlattenedTreeEntity
  startNodeId?: string
}) => {
  if (!startNodeId || __isRootNode({ entity, nodeId: startNodeId })) {
    return 0
  }

  return getIndex({ entity, nodeId: startNodeId })
}

export const getChildNodeIds = ({
  entity,
  nodeId,
}: {
  entity: FlattenedTreeEntity
  nodeId: string
}) => {
  return __isRootNode({ entity, nodeId })
    ? __childNodeIdsOfRootNode({ entity })
    : getFlattenedTreeNode({ entity, nodeId })?.childNodeIds
}

const __childNodeIdsOfRootNode = ({ entity }: { entity: FlattenedTreeEntity }) => {
  return entity.nodes.filter((node) => node.depth === 0).map((node) => node.id)
}

const __isRootNode = ({ entity, nodeId }: { entity: FlattenedTreeEntity; nodeId: string }) => {
  return nodeId === entity.rootNodeId
}
