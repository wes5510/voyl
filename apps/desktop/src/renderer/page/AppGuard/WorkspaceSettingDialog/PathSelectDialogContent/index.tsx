import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/renderer/common/Dialog'
import PathSelectButton from './PathSelectButton'

export interface PathSelectDialogContentProps {
  onSelectPath: (path: string) => void
}

export default function PathSelectDialogContent({
  onSelectPath,
}: PathSelectDialogContentProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>저장 위치</DialogTitle>
        <DialogDescription>데이터를 저장할 폴더를 선택하세요</DialogDescription>
      </DialogHeader>
      <PathSelectButton onSelectPath={onSelectPath} />
    </>
  )
}
