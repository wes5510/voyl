import IconButton from './IconButton'
import useTreeViewStore, { isExpandedNode } from '@/models/treeView/store'
import CollapseIcon from '../shared/CollapseIcon'

export interface CollapseButtonProps {
  nodeId: string
}

export default function ExpandButton({ nodeId }: CollapseButtonProps) {
  const { expanded, toggleExpanded } = useTreeViewStore((state) => ({
    expanded: isExpandedNode({ entity: state.entity, nodeId }),
    toggleExpanded: state.toggleExpandedNode,
  }))

  const handleClick = (): void => {
    toggleExpanded({ nodeId })
  }

  return (
    <IconButton onClick={handleClick}>
      <CollapseIcon expanded={expanded} />
    </IconButton>
  )
}
