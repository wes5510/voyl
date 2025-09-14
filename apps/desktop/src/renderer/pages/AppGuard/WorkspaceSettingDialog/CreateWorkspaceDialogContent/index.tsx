import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/renderer/common/Dialog'
import CreateWorkspaceButton from './CreateWorkspaceButton'
import Description from './Description'

export interface CreateWorkspaceDialogContentProps {
  selectedPath: string
  onClickSelectedPath: () => void
}

export default function CreateWorkspaceDialogContent({
  selectedPath,
  onClickSelectedPath,
}: CreateWorkspaceDialogContentProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>워크스페이스 생성</DialogTitle>
        <DialogDescription>
          <Description
            onClick={onClickSelectedPath}
            selectedPath={selectedPath}
          />
        </DialogDescription>
      </DialogHeader>
      <CreateWorkspaceButton selectedPath={selectedPath} />
    </>
  )
}
