import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { selectWorkspacePath, initializeApp, loadApp } from '@/renderer/repos/app'
import { QUERY_KEYS } from './const'
import { getInitializationQueryOptions } from './queryOptions'

/**
 * 앱 초기화 상태 Hook
 */
export function useAppInitialized() {
  const { data: isInitialized, isLoading, error } = useQuery(getInitializationQueryOptions())
  
  console.log('useAppInitialized:', { isInitialized, isLoading, error })
  
  return { 
    isInitialized: isInitialized ?? false,
    isLoading,
    error
  }
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
      // 1. 초기화 (설정 생성 + 워크스페이스 폴더 생성)
      await initializeApp(path)
      // 2. 로드 (DB 초기화 등)
      await loadApp()
      return true
    },
    onSuccess: () => {
      // 초기화 성공 시 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.initialization() })
    },
  })
}