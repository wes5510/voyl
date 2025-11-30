import { fetchNode, fetchRootNodeId } from '@/renderer/repo/tree'
import { QUERY_KEYS } from './queryKey'

export const getRootNodeIdQueryOptions = () => ({
  queryKey: QUERY_KEYS.rootNodeId(),
  queryFn: fetchRootNodeId,
})

export const getTreeNodeQueryOptions = ({ nodeId }: { nodeId?: string }) => ({
  queryKey: QUERY_KEYS.node({ nodeId }),
  queryFn: () => (nodeId ? fetchNode({ nodeId }) : null),
})
