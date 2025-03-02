import { create } from 'zustand'
import { NodeTableEntity, toggleCollapsedByNodeId, setTitleByNodeId } from './index'

interface NodeTableStore {
  entity: NodeTableEntity
  toggleCollapsed: ({ nodeId }: { nodeId: string }) => void
  setTitleByNodeId: ({ nodeId, title }: { nodeId: string; title: string }) => void
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
  setTitleByNodeId: ({ nodeId, title }: { nodeId: string; title: string }) => {
    set((prev) => ({
      entity: setTitleByNodeId({ entity: prev.entity, nodeId, title }),
    }))
  },
}))

export default useNodeTableStore
export type { NodeTableEntity }
export type { NodeEntity } from './node'
export { getCollapsedByNodeId, getTitleByNodeId } from './index'
