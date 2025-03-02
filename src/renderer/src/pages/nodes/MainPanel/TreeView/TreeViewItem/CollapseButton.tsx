import IconButton from './IconButton'
import useTreeStore, { getCollapsedByNodeId } from '@/models/tree/store'
import CollapseIcon from '../shared/CollapseIcon'

export interface CollapseButtonProps {
  nodeId: string
}

export default function CollapseButton({ nodeId }: CollapseButtonProps): JSX.Element {
  const { collapsed, toggleCollapsed } = useTreeStore((state) => ({
    collapsed: getCollapsedByNodeId({ entity: state.entity, nodeId }),
    toggleCollapsed: state.toggleCollapsed,
  }))

  const handleClick = (): void => {
    toggleCollapsed({ nodeId })
  }

  return (
    <IconButton onClick={handleClick}>
      <CollapseIcon collapsed={collapsed} />
    </IconButton>
  )
}
