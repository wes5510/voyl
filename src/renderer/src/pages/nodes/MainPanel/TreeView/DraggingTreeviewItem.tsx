import { center } from '@/styled-system/patterns'
import { css } from '@/styled-system/css'
import TreeViewItemWrapper from './shared/TreeViewItemWrapper'
import CollapseIcon from './shared/CollapseIcon'
import DotIcon from './shared/DotIcon'
import useTreeStore, { getTitleByNodeId, NodeEntityId } from '@/models/tree/store'
import useTreeViewStore, { getNodeDepth } from '@/models/treeView/store'

export interface DraggingTreeviewItemProps {
  nodeId: NodeEntityId
}

export default function DraggingTreeviewItem({ nodeId }: DraggingTreeviewItemProps) {
  const title = useTreeStore((state) => getTitleByNodeId({ entity: state.entity, nodeId }))
  const depth = useTreeViewStore((state) => getNodeDepth({ entity: state.entity, nodeId }))

  return (
    <TreeViewItemWrapper depth={depth}>
      <div className={center({ w: 6, h: 6 })}>
        <CollapseIcon expanded={false} />
      </div>
      <div className={center({ w: 6, h: 6 })}>
        <DotIcon />
      </div>
      <div className={css({ flex: 1 })}>{title}</div>
    </TreeViewItemWrapper>
  )
}
