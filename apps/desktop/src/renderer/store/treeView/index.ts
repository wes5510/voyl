import { setTopNodeId, TreeViewEntity } from '@/renderer/models/treeView'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

interface TreeViewStore {
  entity: TreeViewEntity
  setTopNodeId: ({ topNodeId }: { topNodeId: string }) => void
}

const __useTreeViewStore = create<TreeViewStore>((set) => ({
  entity: {
    flattenedTree: {
      nodes: [],
      expandedNodeIds: [],
      rootNodeId: 'n-1',
    },
    draggingNode: undefined,
    focusedNodeId: undefined,
    topNodeId: undefined,
  },
  setTopNodeId: ({ topNodeId }) => {
    set((prev) => ({
      entity: setTopNodeId({ entity: prev.entity, topNodeId }),
    }))
  },
}))

const useTreeViewStore = <T>(selector: (state: TreeViewStore) => T) =>
  __useTreeViewStore(useShallow(selector))

export const useTopNodeId = () => useTreeViewStore((state) => state.entity.topNodeId)

export const useSetTopNodeId = () => useTreeViewStore((state) => state.setTopNodeId)
