import { useSelectWorkspacePath } from '@/renderer/store/app'
import { Button } from '@/renderer/common/Button'
import { Loader2, FolderIcon } from 'lucide-react'
import { toast } from 'sonner'

export interface PathSelectButtonProps {
  onSelectPath: (path: string) => void
}

export default function PathSelectButton({
  onSelectPath,
}: PathSelectButtonProps) {
  const selectPath = useSelectWorkspacePath()

  const handleClick = async () => {
    try {
      const path = await selectPath.mutateAsync()
      if (path) {
        onSelectPath(path)
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '경로 선택 중 오류가 발생했습니다.'
      )
    }
  }

  return (
    <Button autoFocus onClick={handleClick} disabled={selectPath.isPending}>
      {selectPath.isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <FolderIcon />
      )}
      저장 위치 선택
    </Button>
  )
}
