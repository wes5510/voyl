import CollapseButton from './CollapseButton'
import DotButton from './DotButton'
import TreeViewItemInput from './TreeViewItemInput'
import { css } from '@styled-system/css'
import TreeViewItemWrapper from './TreeViewItemWrapper'

export interface TreeViewItemProps {
  nodeId: string
}

export default function TreeViewItem({ nodeId }: TreeViewItemProps): JSX.Element {
  return (
    <TreeViewItemWrapper nodeId={nodeId}>
      <CollapseButton nodeId={nodeId} />
      <DotButton />
      <TreeViewItemInput
        nodeId={nodeId}
        className={css({
          flex: 1
        })}
      />
    </TreeViewItemWrapper>
  )
}
