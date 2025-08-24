import { useState } from 'react'
import { useInitializeWorkspace } from '@/renderer/store/app/index.js'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/renderer/common/Dialog.js'
import { Button } from '@/renderer/common/Button.js'
import InitializingView from './InitializingView.js'
import WorkspacePathSelector from './WorkspacePathSelector.js'
import ErrorMessage from './ErrorMessage.js'

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
    <Dialog open={true}>
      <DialogContent 
        className="sm:max-w-[500px]" 
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Voyl 워크스페이스 설정</DialogTitle>
          <DialogDescription>
            데이터를 저장할 폴더를 선택해주세요. 
            Google Drive나 Dropbox 폴더를 선택하면 여러 기기에서 동기화할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <WorkspacePathSelector 
            selectedPath={selectedPath}
            onPathSelect={setSelectedPath}
          />
          
          <ErrorMessage error={initialize.error} />
        </div>

        <DialogFooter>
          <Button
            onClick={handleInitialize}
            disabled={!selectedPath}
          >
            워크스페이스 생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}