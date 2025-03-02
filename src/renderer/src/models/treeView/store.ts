import { create } from 'zustand'
import {
  setRootNodeId,
  setFocusedNodeId,
  TreeViewEntity,
  setFocusToPrevNode,
  setFocusToNextNode,
} from './index'
import { NodeTableEntity } from '../tree/store'

interface TreeViewStore {
  entity: TreeViewEntity
  setRootNodeId: ({
    rootNodeId,
    nodeTable,
  }: {
    rootNodeId: string
    nodeTable: NodeTableEntity
  }) => void
  setFocusedNodeId: ({ nodeId }: { nodeId: string }) => void
  setFocusToPrevNode: () => void
  setFocusToNextNode: () => void
}

const useTreeViewStore = create<TreeViewStore>((set) => ({
  entity: {
    nodes: [],
    draggingNode: undefined,
    focusedNodeId: undefined,
    rootNodeId: '1',
  },
  setRootNodeId: ({ rootNodeId, nodeTable }) => {
    set((prev) => ({
      entity: setRootNodeId({ entity: prev.entity, rootNodeId, nodeTable }),
    }))
  },
  setFocusedNodeId: ({ nodeId }) => {
    set((prev) => ({
      entity: setFocusedNodeId({ entity: prev.entity, nodeId }),
    }))
  },
  setFocusToPrevNode: () => {
    set((prev) => ({
      entity: setFocusToPrevNode({ entity: prev.entity }),
    }))
  },
  setFocusToNextNode: () => {
    set((prev) => ({
      entity: setFocusToNextNode({ entity: prev.entity }),
    }))
  },
}))

export default useTreeViewStore
export { getTreeViewNodes, getDraggingNode, isFocus } from './index'
