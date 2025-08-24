import { FolderIcon, Loader2 } from 'lucide-react'
import { useSelectWorkspacePath } from '@/renderer/store/app'
import { Button } from '@/renderer/common/Button'
import { Alert, AlertDescription } from '@/renderer/common/Alert'

interface WorkspacePathSelectorProps {
  selectedPath: string
  onPathSelect: (path: string) => void
}

export default function WorkspacePathSelector({
  selectedPath,
  onPathSelect,
}: WorkspacePathSelectorProps) {
  const selectPath = useSelectWorkspacePath()

  const handleSelectPath = () => {
    selectPath.mutate(undefined, {
      onSuccess: (path) => {
        if (path) onPathSelect(path)
      },
    })
  }

  return (
    <>
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={handleSelectPath}
          disabled={selectPath.isPending}
          className="w-full max-w-sm"
        >
          {selectPath.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FolderIcon className="mr-2 h-4 w-4" />
          )}
          저장 위치 선택
        </Button>
      </div>

      {selectedPath && (
        <Alert>
          <AlertDescription>
            <strong>선택된 경로:</strong> {selectedPath}
          </AlertDescription>
        </Alert>
      )}

      {selectPath.error && (
        <Alert variant="destructive">
          <AlertDescription>
            {selectPath.error instanceof Error
              ? selectPath.error.message
              : '경로 선택 중 오류가 발생했습니다'}
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
