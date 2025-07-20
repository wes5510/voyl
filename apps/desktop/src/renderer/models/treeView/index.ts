import { DraggingNodeEntity } from './draggingNode'

export interface TreeViewEntity {
  expandedNodeIds: string[]
  focusedNodeId?: string
  draggingNode?: DraggingNodeEntity
  topNodeId?: string
}

export const setTopNodeId = ({
  entity,
  topNodeId,
}: {
  entity: TreeViewEntity
  topNodeId: string
}): TreeViewEntity => {
  return {
    ...entity,
    topNodeId,
  }
}
