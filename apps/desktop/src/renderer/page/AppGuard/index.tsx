import { useAppInitialized } from '@/renderer/store/app'
import WorkspaceSettingDialog from './WorkspaceSettingDialog'

interface AppGuardProps {
  children: React.ReactNode
}

export default function AppGuard({ children }: AppGuardProps) {
  const isInitialized = useAppInitialized()

  return isInitialized ? <>{children}</> : <WorkspaceSettingDialog />
}
