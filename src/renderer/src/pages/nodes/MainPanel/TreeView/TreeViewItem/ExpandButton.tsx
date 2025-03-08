import IconButton from './IconButton'
import useTreeViewStore, { isExpandedNode } from '@/models/treeView/store'
import CollapseIcon from '../shared/CollapseIcon'
import useTreeStore, { getNodeTable } from '@/models/tree/store'

export interface CollapseButtonProps {
  nodeId: string
}

export default function ExpandButton({ nodeId }: CollapseButtonProps) {
  const { expanded, toggleExpanded } = useTreeViewStore((state) => ({
    expanded: isExpandedNode({ entity: state.entity, nodeId }),
    toggleExpanded: state.toggleExpandedNode,
  }))
  const nodeTable = useTreeStore(getNodeTable)

  const handleClick = (): void => {
    toggleExpanded({ nodeId, nodeTable })
  }

  return (
    <IconButton onClick={handleClick}>
      <CollapseIcon expanded={expanded} />
    </IconButton>
  )
}
