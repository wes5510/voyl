import { isInitialized } from '@/renderer/repos/app'
import { QUERY_KEYS } from './const.js'

export const getInitializationQueryOptions = () => ({
  queryKey: QUERY_KEYS.initialization(),
  queryFn: isInitialized,
  retry: false,
  staleTime: Infinity,
  gcTime: Infinity,
})
