import { hstack } from '@styled-system/patterns'
import CollapseButton from './CollapseButton'
import DotButton from './DotButton'
import { useState } from 'react'

export default function TreeViewItem(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false)

  const handleClick = (): void => {
    setCollapsed(!collapsed)
  }

  return (
    <div
      className={hstack({
        gap: 1.5
      })}
    >
      <CollapseButton collapsed={collapsed} onClick={handleClick} />
      <DotButton />
      <div>Text</div>
    </div>
  )
}
