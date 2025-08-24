import { Suspense, useState, useEffect } from 'react'
import NodesPage from './nodes'
import TopBar from './TopBar'
import SideBar from './SideBar'
import AppGuard from './AppGuard'
import InitializingView from './InitializingView'
import { Route, Routes } from 'react-router'
import { useAppInitialized } from '@/renderer/store/app'
import { loadApp } from '@/renderer/repos/app'

export default function IndexPage() {
  const [isAppReady, setIsAppReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isInitialized } = useAppInitialized()

  useEffect(() => {
    if (isInitialized) {
      // 앱이 초기화되어 있으면 loadApp 호출
      loadApp()
        .then(() => {
          console.log('App loaded successfully')
          setIsAppReady(true)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error('Failed to load app:', err)
          setError(err.message || 'Failed to load app')
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [isInitialized])

  // 에러가 있으면 에러 화면 표시
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center p-4">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return <InitializingView />
  }

  // 초기화되지 않았으면 설정 다이얼로그 표시
  if (!isInitialized) {
    return <AppGuard />
  }

  // 앱이 준비되지 않았으면 대기
  if (!isAppReady) {
    return <InitializingView />
  }

  // 앱이 준비되면 메인 UI 렌더링
  return (
    <div className="flex h-screen flex-col gap-0">
      <TopBar />
      <div className="flex w-full flex-1 flex-row gap-0">
        <SideBar />
        <Routes>
          <Route path="nodes" element={<NodesPage />} />
          <Route path="nodes/:nodeId" element={<NodesPage />} />
          <Route path="*" element={<NodesPage />} />
        </Routes>
      </div>
    </div>
  )
}
