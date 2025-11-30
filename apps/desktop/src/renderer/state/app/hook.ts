import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import {
  selectWorkspaceDirPath,
  initializeApp,
  syncApp,
} from '@/renderer/repo/app'
import { QUERY_KEYS } from './queryKey'
import { getInitializationQueryOptions } from './queryOption'

/**
 * 앱 초기화 상태 Hook
 */
export function useAppInitialized() {
  const { data: isInitialized } = useSuspenseQuery(
    getInitializationQueryOptions(),
  )

  return isInitialized ?? false
}

/**
 * 워크스페이스 경로 선택 mutation
 */
export function useSelectWorkspaceDirPath() {
  return useMutation({
    mutationFn: selectWorkspaceDirPath,
  })
}

/**
 * 워크스페이스 초기화 mutation
 */
export function useInitializeWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (path: string) => {
      await initializeApp(path)
      return true
    },
    onSuccess: () => {
      // 초기화 성공 시 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.initialization() })
    },
  })
}

export function useSyncApp() {
  return useMutation({
    mutationFn: syncApp,
  })
}
