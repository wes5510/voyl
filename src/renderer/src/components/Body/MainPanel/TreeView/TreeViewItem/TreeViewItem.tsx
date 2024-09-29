import { hstack } from '@styled-system/patterns'
import CollapseButton from './CollapseButton'
import DotButton from './DotButton'
import { useState } from 'react'
import TreeViewItemInput from './TreeViewItemInput'
import { css } from '@styled-system/css'

export default function TreeViewItem(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false)

  const handleClick = (): void => {
    setCollapsed(!collapsed)
  }

  return (
    <div
      className={hstack({
        gap: 1.5,
        alignItems: 'flex-start'
      })}
    >
      <CollapseButton collapsed={collapsed} onClick={handleClick} />
      <DotButton />
      <TreeViewItemInput
        className={css({
          flex: 1
        })}
      />
    </div>
  )
}
