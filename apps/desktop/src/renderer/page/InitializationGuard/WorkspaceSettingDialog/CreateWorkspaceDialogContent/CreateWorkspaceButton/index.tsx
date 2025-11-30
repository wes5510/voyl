import { Button } from '@/renderer/common/Button'
import { isPathEmpty } from './util'
import { useInitializeWorkspace } from '@/renderer/state/app'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export interface CreateWorkspaceButtonProps {
  selectedPath: string
}

export default function CreateWorkspaceButton({
  selectedPath,
}: CreateWorkspaceButtonProps) {
  const initialize = useInitializeWorkspace()
  const handleClick = async () => {
    if (isPathEmpty(selectedPath)) {
      return
    }

    try {
      await initialize.mutateAsync(selectedPath)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '워크스페이스 생성에 실패했습니다'
      )
    }
  }
  return (
    <Button
      onClick={handleClick}
      className="flex-1"
      autoFocus
      disabled={initialize.isPending}
    >
      {initialize.isPending && <Loader2 className="animate-spin" />}
      시작하기
    </Button>
  )
}
