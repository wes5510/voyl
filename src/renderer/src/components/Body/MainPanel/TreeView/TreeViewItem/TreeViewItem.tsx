import { hstack } from '@styled-system/patterns'
import CollapseButton from './CollapseButton'
import DotButton from './DotButton'
import { MouseEventHandler } from 'react'
import TreeViewItemInput from './TreeViewItemInput'
import { css } from '@styled-system/css'

export interface TreeViewItemProps {
  initialText: string
  collapsed: boolean
  onClickCollapseButton: MouseEventHandler
  onChangeText: (text: string) => void
}

export default function TreeViewItem({
  initialText,
  collapsed,
  onClickCollapseButton,
  onChangeText
}: TreeViewItemProps): JSX.Element {
  return (
    <div
      className={hstack({
        gap: 1.5,
        alignItems: 'flex-start'
      })}
    >
      <CollapseButton collapsed={collapsed} onClick={onClickCollapseButton} />
      <DotButton />
      <TreeViewItemInput
        initialValue={initialText}
        onChangeValue={onChangeText}
        className={css({
          flex: 1
        })}
      />
    </div>
  )
}
