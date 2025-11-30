import { isInitialized } from '@/renderer/repo/app'
import { QUERY_KEYS } from './queryKey'

export const getInitializationQueryOptions = () => ({
  queryKey: QUERY_KEYS.initialization(),
  queryFn: isInitialized,
  retry: false,
  staleTime: Infinity,
  gcTime: Infinity,
})
