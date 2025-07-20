import { setTopNodeId, TreeViewEntity } from '@/renderer/models/treeView'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getTreeViewNodesQueryOptions } from './queryOptions'

interface TreeViewStore {
  entity: TreeViewEntity
  setTopNodeId: ({ topNodeId }: { topNodeId: string }) => void
}

const __useTreeViewStore = create<TreeViewStore>((set) => ({
  entity: {
    expandedNodeIds: [],
    topNodeId: undefined,
    focusedNodeId: undefined,
    draggingNode: undefined,
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

export const useTreeViewNodes = ({ topNodeId }: { topNodeId?: string }) => {
  const { data } = useSuspenseQuery(getTreeViewNodesQueryOptions({ topNodeId }))
  return data
}
