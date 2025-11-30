import { fetchTreeViewNodes } from '@/renderer/repo/treeView'
import { TREE_VIEW_QUERY_KEYS } from './queryKey'

export const getTreeViewNodesQueryOptions = ({ topNodeId }: { topNodeId?: string }) => ({
  queryKey: TREE_VIEW_QUERY_KEYS.nodes({ topNodeId }),
  queryFn: () => (topNodeId ? fetchTreeViewNodes({ topNodeId }) : []),
  staleTime: 30 * 60 * 1000, // 30분
})
