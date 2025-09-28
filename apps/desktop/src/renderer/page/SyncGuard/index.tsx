import { useSyncApp } from '@/renderer/store/app'
import { Loader2 } from 'lucide-react'

interface SyncGuardProps {
  children: React.ReactNode
}

export default function SyncGuard({ children }: SyncGuardProps) {
  const sync = useSyncApp()

  return sync.isPending ? <Loader2 className="animate-spin" /> : <>{children}</>
}
