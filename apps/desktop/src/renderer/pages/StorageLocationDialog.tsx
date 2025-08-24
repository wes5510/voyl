import { useState } from 'react'
import { useInitializeWorkspace } from '@/renderer/store/app'
import InitializingView from './InitializingView'
import WorkspacePathSelector from './WorkspacePathSelector'
import ErrorMessage from './ErrorMessage'

export default function StorageLocationDialog() {
  const [selectedPath, setSelectedPath] = useState('')
  const initialize = useInitializeWorkspace()

  const handleInitialize = () => {
    if (!selectedPath) return
    initialize.mutate(selectedPath)
  }

  if (initialize.isPending) {
    return <InitializingView />
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-background border rounded-lg p-6 w-full max-w-lg">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Voyl 워크스페이스 설정</h2>
          <p className="text-sm text-muted-foreground">
            데이터를 저장할 폴더를 선택해주세요. 
            Google Drive나 Dropbox 폴더를 선택하면 여러 기기에서 동기화할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-4 py-4">
          <WorkspacePathSelector 
            selectedPath={selectedPath}
            onPathSelect={setSelectedPath}
          />
          
          <ErrorMessage error={initialize.error} />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleInitialize}
            disabled={!selectedPath}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            워크스페이스 생성
          </button>
        </div>
      </div>
    </div>
  )
}