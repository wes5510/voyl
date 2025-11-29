import {
  setTopNodeId,
  setFocusedNodeId,
  TreeViewEntity,
} from '@/renderer/model/treeView'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { getTreeViewNodesQueryOptions } from './queryOptions'
import { addNewNodeAfter, removeNode } from '@/renderer/repo/treeView'
// eslint-disable-next-line voyl/same-level-import
import { QUERY_KEYS } from '../tree/queryKeys'
import { NodeDTO } from '@/renderer/repo/tree'
import { TREE_VIEW_QUERY_KEYS } from './queryKeys'

interface TreeViewStore {
  entity: TreeViewEntity
  setTopNodeId: ({ topNodeId }: { topNodeId: string }) => void
  setFocusedNodeId: ({ nodeId }: { nodeId: string }) => void
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
  setFocusedNodeId: ({ nodeId }) => {
    set((prev) => ({
      entity: setFocusedNodeId({ entity: prev.entity, nodeId }),
    }))
  },
}))

const useTreeViewStore = <T>(selector: (state: TreeViewStore) => T) =>
  __useTreeViewStore(useShallow(selector))

export const useTopNodeId = () =>
  useTreeViewStore((state) => state.entity.topNodeId)

export const useSetTopNodeId = () =>
  useTreeViewStore((state) => state.setTopNodeId)

export const useFocusedNodeId = () =>
  useTreeViewStore((state) => state.entity.focusedNodeId)

export const useSetFocusedNodeId = () =>
  useTreeViewStore((state) => state.setFocusedNodeId)

export const useTreeViewNodes = ({ topNodeId }: { topNodeId?: string }) => {
  const { data } = useSuspenseQuery(getTreeViewNodesQueryOptions({ topNodeId }))
  return data
}

export const useAddNewNodeAfter = () => {
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: addNewNodeAfter,
    onSuccess: (newNode: NodeDTO) => {
      if (newNode.parentId) {
        queryClient.invalidateQueries({
          queryKey: TREE_VIEW_QUERY_KEYS.nodes({ topNodeId: newNode.parentId }),
        })
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.node({ nodeId: newNode.parentId }),
        })
      }

      queryClient.setQueryData(QUERY_KEYS.node({ nodeId: newNode.id }), newNode)
    },
  })
  return mutateAsync
}

export const useRemoveNode = () => {
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: removeNode,
    onSuccess: (removedNode: NodeDTO) => {
      if (removedNode.parentId) {
        queryClient.invalidateQueries({
          queryKey: TREE_VIEW_QUERY_KEYS.nodes({
            topNodeId: removedNode.parentId,
          }),
        })
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.node({ nodeId: removedNode.parentId }),
        })
      }

      queryClient.setQueryData(
        QUERY_KEYS.node({ nodeId: removedNode.id }),
        null,
      )
    },
  })
  return mutateAsync
}
