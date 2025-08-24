import { useSelectWorkspacePath } from '@/renderer/store/app'

interface WorkspacePathSelectorProps {
  selectedPath: string
  onPathSelect: (path: string) => void
}

export default function WorkspacePathSelector({ 
  selectedPath, 
  onPathSelect 
}: WorkspacePathSelectorProps) {
  const selectPath = useSelectWorkspacePath()

  const handleSelectPath = () => {
    selectPath.mutate(undefined, {
      onSuccess: (path) => {
        if (path) onPathSelect(path)
      }
    })
  }

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={handleSelectPath}
          disabled={selectPath.isPending}
          className="w-full max-w-sm px-4 py-2 border rounded hover:bg-accent flex items-center justify-center gap-2"
        >
          {selectPath.isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          )}
          저장 위치 선택
        </button>
      </div>

      {selectedPath && (
        <div className="rounded-lg border px-4 py-3 text-sm">
          <strong>선택된 경로:</strong> {selectedPath}
        </div>
      )}

      {selectPath.error && (
        <div className="rounded-lg border border-destructive/50 text-destructive px-4 py-3 text-sm">
          {selectPath.error instanceof Error ? selectPath.error.message : '경로 선택 중 오류가 발생했습니다'}
        </div>
      )}
    </>
  )
}