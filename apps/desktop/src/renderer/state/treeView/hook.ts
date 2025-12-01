import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useSnapshot } from 'valtio'
import { getTreeViewNodesQueryOptions } from './queryOption'
import { addNewNodeAfter, removeNode } from '@/renderer/repo/treeView'
import { getPreviousFocusableNodeId } from '@/renderer/repo/node'
import { NodeDTO } from '@/renderer/repo/tree'
import { TREE_VIEW_QUERY_KEYS } from './queryKey'
// eslint-disable-next-line voyl/same-level-import
import { QUERY_KEYS } from '../tree/queryKey'
import { treeViewStore } from './store'

/**
 * Top Node ID 조회
 */
export const useTopNodeId = () => {
  const snap = useSnapshot(treeViewStore)
  return snap.topNodeId
}

/**
 * Focused Node ID 조회
 */
export const useFocusedNodeId = () => {
  const snap = useSnapshot(treeViewStore)
  return snap.focusedNodeId
}

/**
 * TreeView Nodes 조회 (React Query)
 */
export const useTreeViewNodes = ({ topNodeId }: { topNodeId?: string }) => {
  const { data } = useSuspenseQuery(getTreeViewNodesQueryOptions({ topNodeId }))
  return data
}

/**
 * 노드 추가 Mutation
 */
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

/**
 * 노드 제거 Mutation
 */
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

/**
 * 이전 포커스 가능한 노드 ID 조회
 * (삭제 직전 호출용, 직접 repo 함수를 re-export)
 */
export { getPreviousFocusableNodeId }