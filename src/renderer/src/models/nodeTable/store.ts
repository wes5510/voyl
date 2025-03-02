import { create } from 'zustand'
import { NodeTableEntity } from './index'

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
