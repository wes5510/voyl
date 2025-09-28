import { useAppInitialized } from '@/renderer/store/app'
import WorkspaceSettingDialog from './WorkspaceSettingDialog'

interface InitializationGuardProps {
  children: React.ReactNode
}

export default function InitializationGuard({
  children,
}: InitializationGuardProps) {
  const isInitialized = useAppInitialized()

  return isInitialized ? <>{children}</> : <WorkspaceSettingDialog />
}
