import { useAppInitialized } from '@/renderer/store/app/index.js'
import StorageLocationDialog from './StorageLocationDialog.js'

export default function AppGuard() {
  const { isInitialized } = useAppInitialized()

  // 이미 초기화되었으면 아무것도 표시하지 않음
  if (isInitialized) return null

  return <StorageLocationDialog />
}