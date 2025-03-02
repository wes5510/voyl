import { center } from '@/styled-system/patterns'
import { css } from '@/styled-system/css'
import TreeViewItemWrapper from './shared/TreeViewItemWrapper'
import CollapseIcon from './shared/CollapseIcon'
import DotIcon from './shared/DotIcon'

export interface DraggingTreeviewItemProps {
  depth: number
  title: string
}

export default function DraggingTreeviewItem({
  depth,
  title,
}: DraggingTreeviewItemProps): JSX.Element {
  return (
    <TreeViewItemWrapper depth={depth}>
      <div className={center({ w: 6, h: 6 })}>
        <CollapseIcon collapsed />
      </div>
      <div className={center({ w: 6, h: 6 })}>
        <DotIcon />
      </div>
      <div className={css({ flex: 1 })}>{title}</div>
    </TreeViewItemWrapper>
  )
}
