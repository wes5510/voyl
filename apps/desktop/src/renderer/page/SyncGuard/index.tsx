import { useSyncApp } from '@/renderer/store/app'
import SyncSplash from './SyncSplash'

interface SyncGuardProps {
  children: React.ReactNode
}

export default function SyncGuard({ children }: SyncGuardProps) {
  const sync = useSyncApp()

  console.log({ sync })

  return sync.isPending ? <SyncSplash /> : <>{children}</>
}
