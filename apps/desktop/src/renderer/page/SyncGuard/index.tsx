import { useSyncApp } from '@/renderer/store/app'
import SyncSplash from './SyncSplash'
import { useEffect } from 'react'

interface SyncGuardProps {
  children: React.ReactNode
}

export default function SyncGuard({ children }: SyncGuardProps) {
  const { mutate, isPending } = useSyncApp()

  useEffect(() => {
    mutate()
  }, [mutate])

  return isPending ? <SyncSplash /> : <>{children}</>
}
