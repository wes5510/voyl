import { useSyncApp } from '@/renderer/state/app'
import { useEffect } from 'react'

interface SyncGuardProps {
  children: React.ReactNode
}

export default function SyncGuard({ children }: SyncGuardProps) {
  const { mutateAsync, isPending } = useSyncApp()

  useEffect(() => {
    mutateAsync()
  }, [mutateAsync])

  return isPending ? null : <>{children}</>
}
