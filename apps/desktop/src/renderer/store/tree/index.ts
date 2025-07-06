import { fetchRootNodeId } from '@/renderer/repos/tree'
import { QUERY_KEYS } from './queryKeys'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useRootNodeId = () => {
  const { data } = useSuspenseQuery({
    queryKey: QUERY_KEYS.rootNodeId(),
    queryFn: fetchRootNodeId,
  })

  return data
}
