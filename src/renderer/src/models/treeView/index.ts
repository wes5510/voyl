import { NodeEntity } from '../nodeTable/store'

export interface TreeViewEntity {
  nodes: TreeViewNode[]
  rootNodeId: string
  focusedNodeId?: string
  draggingNode?: DraggingNode
}

interface DraggingNode {
  id: string
  title: string
  depth: number
}

interface TreeViewNode {
  id: string
  depth: number
  collapsed: boolean
  childNodeIds: string[]
}

type NodeTable = Map<string, NodeEntity>

export const getTreeViewNodes = ({ entity }: { entity: TreeViewEntity }): TreeViewNode[] => {
  return entity.nodes
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
  if (entity.rootNodeId === rootNodeId) {
    return entity
  }

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
  entity: TreeViewEntity
  nodeTable: NodeTable
}): TreeViewEntity => {
  return {
    ...entity,
    nodes: __flattenNodes({
      nodes: [
        __nodeToTreeViewNode({
          node: nodeTable.get(entity.rootNodeId),
          depth: 0,
        }),
      ],
      nodeTable,
    }),
  }
}

const __flattenNodes = ({
  nodes,
  nodeTable,
}: {
  nodes: TreeViewNode[]
  nodeTable: NodeTable
}): TreeViewNode[] =>
  nodes.reduce((acc, node): TreeViewNode[] => {
    if (node.collapsed) {
      return acc
    }

    const childNodeIds = nodeTable.get(node.id)?.childNodeIds ?? []

    return [
      ...acc,
      node,
      ...__flattenNodes({
        nodes: childNodeIds.map((id) =>
          __nodeToTreeViewNode({ node: nodeTable.get(id), depth: node.depth + 1 }),
        ),
        nodeTable,
      }),
    ]
  }, [] as TreeViewNode[])

const __nodeToTreeViewNode = ({
  node,
  depth,
}: {
  node?: NodeEntity
  depth: number
}): TreeViewNode => {
  if (!node) {
    throw new Error('Node is undefined')
  }

  return {
    id: node.id,
    depth,
    collapsed: node.collapsed,
    childNodeIds: node.childNodeIds,
  }
}

export const setFocusedNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeViewEntity
  nodeId: string
}): TreeViewEntity => {
  return {
    ...entity,
    focusedNodeId: nodeId,
  }
}

export const isFocus = ({ entity, nodeId }: { entity: TreeViewEntity; nodeId: string }): boolean =>
  entity.focusedNodeId === nodeId
