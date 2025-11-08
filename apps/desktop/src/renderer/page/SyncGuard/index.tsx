import { useSyncApp } from '@/renderer/store/app'
import SyncSplash from './SyncSplash'
import { useEffect } from 'react'

interface SyncGuardProps {
  children: React.ReactNode
}

export default function SyncGuard({ children }: SyncGuardProps) {
  const sync = useSyncApp()

  useEffect(() => {
    sync.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return sync.isPending ? <SyncSplash /> : <>{children}</>
}
