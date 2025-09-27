import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { selectWorkspacePath, initializeApp } from '@/renderer/repos/app.js'
import { QUERY_KEYS } from './const.js'
import { getInitializationQueryOptions } from './queryOptions.js'

/**
 * 앱 초기화 상태 Hook
 */
export function useAppInitialized() {
  const { data: isInitialized } = useSuspenseQuery(getInitializationQueryOptions())

  return isInitialized ?? false
}

/**
 * 워크스페이스 경로 선택 mutation
 */
export function useSelectWorkspacePath() {
  return useMutation({
    mutationFn: selectWorkspacePath,
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
