import { NodeEntity } from './node'

export type NodeTableEntity = Map<NodeEntity['id'], NodeEntity>

export const createNodeTable = (): NodeTableEntity => {
  return new Map()
}

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
  nodeId: NodeEntity['id']
}): NodeEntity | undefined => {
  return entity.get(nodeId)
}

export const removeNode = ({
  entity,
  nodeId,
}: {
  entity: NodeTableEntity
  nodeId: NodeEntity['id']
}): NodeTableEntity => {
  const newEntity = new Map(entity)
  newEntity.delete(nodeId)

  return newEntity
}

export const setNodes = ({
  entity,
  nodes,
}: {
  entity: NodeTableEntity
  nodes: NodeEntity[]
}): NodeTableEntity => {
  const newEntity = new Map(entity)

  nodes.forEach((node) => {
    newEntity.set(node.id, node)
  })

  return newEntity
}
