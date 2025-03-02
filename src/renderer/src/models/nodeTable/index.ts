import { create } from 'zustand'
import { NodeTableEntity } from './nodeTable'

interface NodeTableStore {
  entity: NodeTableEntity
}

const useNodeTableStore = create<NodeTableStore>(() => ({
  entity: {
    nodeTable: new Map(),
  },
}))

export default useNodeTableStore
export type { NodeTableEntity }
export type { NodeEntity } from './node'
