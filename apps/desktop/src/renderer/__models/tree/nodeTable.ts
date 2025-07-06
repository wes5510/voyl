import { NodeEntity, NodeEntityId } from './node'

export type NodeTableEntity = Map<NodeEntityId, NodeEntity>

export const setNode = ({
  entity,
  node,
}: {
  entity: NodeTableEntity
  node: NodeEntity
}): NodeTableEntity => {
  return new Map(entity).set(node.id, node)
}

export const getNode = ({
  entity,
  nodeId,
}: {
  entity: NodeTableEntity
  nodeId: NodeEntityId
}): NodeEntity | undefined => {
  return entity.get(nodeId)
}

export const removeNodes = ({
  entity,
  nodeIds,
}: {
  entity: NodeTableEntity
  nodeIds: NodeEntityId[]
}): NodeTableEntity => {
  const newEntity = new Map(entity)

  nodeIds.forEach((nodeId) => {
    newEntity.delete(nodeId)
  })

  return newEntity
}

export const isExistNode = ({
  entity,
  nodeId,
}: {
  entity: NodeTableEntity
  nodeId: NodeEntityId
}): boolean => {
  return entity.has(nodeId)
}
