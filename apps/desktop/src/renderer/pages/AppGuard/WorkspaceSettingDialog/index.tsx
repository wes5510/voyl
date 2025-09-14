import { Dialog, DialogContent } from '@/renderer/common/Dialog'
import PathSelectDialogContent from './PathSelectDialogContent'
import CreateWorkspaceDialogContent from './CreateWorkspaceDialogContent'
import { useState, useTransition } from 'react'

export default function WorkspaceSettingDialog() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const hasSelectedPath = selectedPath !== null

  const handleSelectPath = (path: string) => {
    startTransition(() => {
      setSelectedPath(path)
    })
  }

  const handleClickSelectedPath = () => {
    startTransition(() => {
      setSelectedPath(null)
    })
  }

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[450px]" hideCloseButton>
        <div
          className={`grid gap-4 transition-opacity duration-300 ${
            isPending ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {hasSelectedPath ? (
            <CreateWorkspaceDialogContent
              selectedPath={selectedPath}
              onClickSelectedPath={handleClickSelectedPath}
            />
          ) : (
            <PathSelectDialogContent onSelectPath={handleSelectPath} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
