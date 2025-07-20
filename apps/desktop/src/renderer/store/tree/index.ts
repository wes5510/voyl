import { useSuspenseQuery } from '@tanstack/react-query'
import { getRootNodeIdQueryOptions, getTreeNodeQueryOptions } from './queryOptions'

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
