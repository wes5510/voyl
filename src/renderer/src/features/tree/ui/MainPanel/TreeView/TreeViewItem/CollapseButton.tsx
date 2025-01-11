import { css } from '@/styled-system/css'
import IconButton from './IconButton'
import ChevronRightIcon from '@/common/ChevronRightIcon'
import useTreeStore, { getCollapsed } from '@/features/tree/model'

export interface CollapseButtonProps {
  nodeId: string
}

export default function CollapseButton({ nodeId }: CollapseButtonProps): JSX.Element {
  const { collapsed, setCollapsed } = useTreeStore((state) => ({
    collapsed: getCollapsed({ entity: state, nodeId }),
    setCollapsed: state.setCollapsed,
  }))

  const handleClick = (): void => {
    setCollapsed({ nodeId, collapsed: !collapsed })
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
