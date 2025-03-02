import { create } from 'zustand'
import { NodeTableEntity, toggleCollapsedByNodeId } from './index'

interface NodeTableStore {
  entity: NodeTableEntity
  toggleCollapsed: ({ nodeId }: { nodeId: string }) => void
}

const useNodeTableStore = create<NodeTableStore>((set) => ({
  entity: {
    nodeTable: new Map(),
  },
  toggleCollapsed: ({ nodeId }: { nodeId: string }) => {
    set((prev) => ({
      entity: toggleCollapsedByNodeId({
        entity: prev.entity,
        nodeId,
      }),
    }))
  },
}))

export default useNodeTableStore
export type { NodeTableEntity }
export type { NodeEntity } from './node'
export { getCollapsedByNodeId } from './index'
