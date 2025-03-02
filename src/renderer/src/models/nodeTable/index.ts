import { getTaskTitle, NodeEntity, setTaskTitle, toggleCollapsed } from './node'

export interface NodeTableEntity {
  nodeTable: Map<NodeEntity['id'], NodeEntity>
}

export const createNodeTable = (): NodeTableEntity => {
  return { nodeTable: new Map() }
}

export const toggleCollapsedByNodeId = ({
  entity,
  nodeId,
}: {
  entity: NodeTableEntity
  nodeId: NodeEntity['id']
}): NodeTableEntity => {
  const node = entity.nodeTable.get(nodeId)

  return node
    ? {
        ...entity,
        nodeTable: entity.nodeTable.set(nodeId, toggleCollapsed({ entity: node })),
      }
    : entity
}

export const getCollapsedByNodeId = ({
  entity,
  nodeId,
}: {
  entity: NodeTableEntity
  nodeId: NodeEntity['id']
}): boolean => {
  const node = entity.nodeTable.get(nodeId)
  return node ? node.collapsed : false
}

export const setTitleByNodeId = ({
  entity,
  nodeId,
  title,
}: {
  entity: NodeTableEntity
  nodeId: NodeEntity['id']
  title: NodeEntity['task']['title']
}): NodeTableEntity => {
  const node = entity.nodeTable.get(nodeId)

  return node
    ? {
        ...entity,
        nodeTable: entity.nodeTable.set(nodeId, setTaskTitle({ entity: node, title })),
      }
    : entity
}

export const getTitleByNodeId = ({
  entity,
  nodeId,
}: {
  entity: NodeTableEntity
  nodeId: NodeEntity['id']
}): NodeEntity['task']['title'] => {
  const node = entity.nodeTable.get(nodeId)
  return node ? getTaskTitle({ entity: node }) : ''
}
