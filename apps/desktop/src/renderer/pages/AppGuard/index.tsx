import { useAppInitialized } from '@/renderer/store/app'
import StorageLocationDialog from './StorageLocationDialog'

interface AppGuardProps {
  children: React.ReactNode
}

export default function AppGuard({ children }: AppGuardProps) {
  const isInitialized = useAppInitialized()

  // 앱이 초기화되지 않았으면 초기화 다이얼로그 표시
  if (!isInitialized) {
    return <StorageLocationDialog />
  }

  // 초기화가 완료되면 자식 컴포넌트 렌더링
  return <>{children}</>
}
