import TreeViewItemWrapper from './shared/Wrapper'
import CollapseIcon from './shared/CollapseIcon'
import DotIcon from './shared/DotIcon'
import useTreeStore, { getTitleByNodeId, NodeEntityId } from '@/renderer/models/tree/store'
import useTreeViewStore, { getNodeDepth } from '@/renderer/models/treeView/store'

export interface DraggingTreeviewItemProps {
  nodeId: NodeEntityId
}

export default function DraggingTreeviewItem({ nodeId }: DraggingTreeviewItemProps) {
  const title = useTreeStore((state) => getTitleByNodeId({ entity: state.entity, nodeId }))
  const depth = useTreeViewStore((state) => getNodeDepth({ entity: state.entity, nodeId }))

  return (
    <TreeViewItemWrapper depth={depth}>
      <div className="flex h-6 w-6 items-center justify-center">
        <CollapseIcon expanded={false} />
      </div>
      <div className="flex h-6 w-6 items-center justify-center">
        <DotIcon />
      </div>
      <div className="flex-1">{title}</div>
    </TreeViewItemWrapper>
  )
}
