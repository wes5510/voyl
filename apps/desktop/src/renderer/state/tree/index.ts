import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import {
  getRootNodeIdQueryOptions,
  getTreeNodeQueryOptions,
} from './queryOption'
import { updateNodeTitle } from '@/renderer/repo/node'
import { QUERY_KEYS } from './queryKey'

export const useRootNodeId = () => {
  const { data } = useSuspenseQuery(getRootNodeIdQueryOptions())

  return data
}

export const useTreeNode = ({ nodeId }: { nodeId?: string }) => {
  const { data } = useSuspenseQuery(getTreeNodeQueryOptions({ nodeId }))
  return data
}

export const useTreeNodeTitle = ({ nodeId }: { nodeId?: string }) => {
  const { data } = useSuspenseQuery({
    ...getTreeNodeQueryOptions({ nodeId }),
    select: (data) => data?.title,
  })

  return data
}

export const useIsRootNodeId = ({ nodeId }: { nodeId?: string }) => {
  const { data } = useSuspenseQuery({
    ...getRootNodeIdQueryOptions(),
    select: (rootNodeId) => rootNodeId === nodeId,
  })

  return data
}

export const useUpdateNodeTitle = () => {
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: updateNodeTitle,
    onSuccess: (_data, { nodeId }: { nodeId: string; title: string }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.node({ nodeId }),
      })
    },
  })

  return mutateAsync
}
