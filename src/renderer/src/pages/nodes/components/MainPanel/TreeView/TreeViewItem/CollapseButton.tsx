import { css } from '@/styled-system/css'
import IconButton from './IconButton'
import { useAtom } from 'jotai'
import ChevronRightIcon from 'src/renderer/src/common/ChevronRightIcon'
import { collapsedNodeAtom } from '@/features/tree/model/tree'

export interface CollapseButtonProps {
  nodeId: string
}

export default function CollapseButton({ nodeId }: CollapseButtonProps): JSX.Element {
  const [collapsed, setCollapsed] = useAtom(collapsedNodeAtom(nodeId))

  const handleClick = (): void => {
    setCollapsed({ collapsed: !collapsed })
  }

  return (
    <IconButton onClick={handleClick}>
      <ChevronRightIcon
        className={css({
          w: 4,
          h: 4,
          transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
          translate: 'transform',
          transitionDuration: 'normal',
        })}
      />
    </IconButton>
  )
}
