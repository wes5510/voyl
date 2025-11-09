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

export const setFocusedNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeViewEntity
  nodeId: string
}): TreeViewEntity => {
  return {
    ...entity,
    focusedNodeId: nodeId,
  }
}
