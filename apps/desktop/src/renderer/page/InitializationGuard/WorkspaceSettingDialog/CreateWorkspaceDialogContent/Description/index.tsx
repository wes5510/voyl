import Tooltip from '@/renderer/common/Tooltip'
import { Button } from '@/renderer/common/Button'
import { truncatePath } from './util'

export interface DescriptionProps {
  selectedPath: string
  onClick: () => void
}

export default function Description({
  selectedPath,
  onClick,
}: DescriptionProps) {
  return (
    <div className="flex items-center gap-1">
      <Tooltip content="클릭하여 경로 변경" side="bottom">
        <Button
          variant="link"
          className="text-muted-foreground hover:text-foreground h-auto p-0 text-sm font-normal underline underline-offset-2"
          onClick={onClick}
        >
          {truncatePath(selectedPath)}
        </Button>
      </Tooltip>
      에 워크스페이스가 생성됩니다
    </div>
  )
}
