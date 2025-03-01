import { NodeEntity } from './node'

export interface NodeTableEntity {
  nodes: Map<NodeEntity['id'], NodeEntity>
}

export const getNode = ({
  entity,
  nodeId,
}: {
  entity: NodeTableEntity
  nodeId: NodeEntity['id']
}): NodeEntity | undefined => entity.nodes.get(nodeId)

export const setNode = ({
  entity,
  node,
}: {
  entity: NodeTableEntity
  node: NodeEntity
}): NodeTableEntity => ({
  nodes: entity.nodes.set(node.id, node),
})

export const removeNode = ({
  entity,
  node,
}: {
  entity: NodeTableEntity
  node: NodeEntity
}): NodeTableEntity => {
  const __new = new Map(entity.nodes)
  __new.delete(node.id)

  return {
    nodes: __new,
  }
}
