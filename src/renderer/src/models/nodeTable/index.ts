import { NodeEntity, toggleCollapsed } from './node'

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

  if (!node) {
    return entity
  }

  return {
    ...entity,
    nodeTable: entity.nodeTable.set(nodeId, toggleCollapsed({ entity: node })),
  }
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
