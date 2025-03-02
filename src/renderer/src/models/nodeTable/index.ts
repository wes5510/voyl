import { NodeEntity } from './node'

export interface NodeTableEntity {
  nodeTable: Map<NodeEntity['id'], NodeEntity>
}

export const createNodeTable = (): NodeTableEntity => {
  return { nodeTable: new Map() }
}
