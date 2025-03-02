import { getTaskTitle, NodeEntity, setTaskTitle, toggleCollapsed } from './node'
import { getNode, NodeTableEntity, setNode } from './nodeTable'

export interface TreeEntity {
  nodeTable: NodeTableEntity
}

export const toggleCollapsedByNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntity['id']
}): TreeEntity => {
  const node = getNode({ entity: entity.nodeTable, nodeId })

  return node
    ? {
        ...entity,
        nodeTable: setNode({
          entity: entity.nodeTable,
          node: toggleCollapsed({ entity: node }),
        }),
      }
    : entity
}

export const getCollapsedByNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntity['id']
}): boolean => {
  const node = getNode({ entity: entity.nodeTable, nodeId })
  return node ? node.collapsed : false
}

export const setTitleByNodeId = ({
  entity,
  nodeId,
  title,
}: {
  entity: TreeEntity
  nodeId: NodeEntity['id']
  title: NodeEntity['task']['title']
}): TreeEntity => {
  const node = getNode({ entity: entity.nodeTable, nodeId })

  return node
    ? {
        ...entity,
        nodeTable: setNode({
          entity: entity.nodeTable,
          node: setTaskTitle({ entity: node, title }),
        }),
      }
    : entity
}

export const getTitleByNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntity['id']
}): NodeEntity['task']['title'] => {
  const node = getNode({ entity: entity.nodeTable, nodeId })
  return node ? getTaskTitle({ entity: node }) : ''
}

export const insertNewNodeAfter = ({
  entity,
  sourceNode,
  newNodeTitle,
}: {
  entity: TreeEntity
  sourceNode: {
    id: NodeEntity['id']
    title: NodeEntity['task']['title']
  }
  newNodeTitle: NodeEntity['task']['title']
}): TreeEntity => {
  return entity
}

export const getNodeTable = (entity: TreeEntity): NodeTableEntity => {
  return entity.nodeTable
}
