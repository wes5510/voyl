import { css } from '@/styled-system/css'
import IconButton from './IconButton'
import ChevronRightIcon from 'src/renderer/src/shared/ChevronRightIcon'
import useTreeStore from '@/features/tree/model'
import { getCollapsed } from '@/features/tree/model/tree/new_index'

export interface CollapseButtonProps {
  nodeId: string
}

export default function CollapseButton({ nodeId }: CollapseButtonProps): JSX.Element {
  const { collapsed, setCollapsed } = useTreeStore((state) => ({
    collapsed: getCollapsed({ entity: state, nodeId }),
    setCollapsed: state.setCollapsed,
  }))

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
