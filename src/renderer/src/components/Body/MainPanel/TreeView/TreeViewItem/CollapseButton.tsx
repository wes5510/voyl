import ChevronRightIcon from '../../../../Icon/ChevronRightIcon'
import { css } from '@styled-system/css'
import IconButton from './IconButton'
import { useAtom } from 'jotai'
import { collapsedAtom } from './store'

export interface CollapseButtonProps {
  nodeId: string
}

export default function CollapseButton({ nodeId }: CollapseButtonProps): JSX.Element {
  const [collapsed, setCollapsed] = useAtom(collapsedAtom(nodeId))

  const handleClick = (): void => {
    setCollapsed(!collapsed)
  }

  return (
    <IconButton onClick={handleClick}>
      <ChevronRightIcon
        className={css({
          w: 4,
          h: 4,
          transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
          translate: 'transform',
          transitionDuration: 'normal'
        })}
      />
    </IconButton>
  )
}
