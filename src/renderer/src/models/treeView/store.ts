import { create } from 'zustand'
import {
  setRootNodeId,
  setFocusedNodeId,
  TreeViewEntity,
  setFocusToPrevNode,
  setFocusToNextNode,
  setFocusForRemovedNode,
  toggleExpandedNode,
} from './index'
import { NodeTableEntity } from '../tree/store'
import { useShallow } from 'zustand/react/shallow'

interface TreeViewStore {
  entity: TreeViewEntity
  setRootNodeId: ({
    rootNodeId,
    nodeTable,
  }: {
    rootNodeId: string
    nodeTable: NodeTableEntity
  }) => void
  setFocusedNodeId: ({ nodeId }: { nodeId?: string }) => void
  setFocusToPrevNode: () => void
  setFocusToNextNode: () => void
  setFocusForRemovedNode: ({ nodeId }: { nodeId: string }) => void
  toggleExpandedNode: ({ nodeId }: { nodeId: string }) => void
}

const __useTreeViewStore = create<TreeViewStore>((set) => ({
  entity: {
    flattenedTree: {
      nodes: [],
      expandedNodeIds: [],
      rootNodeId: 'n-1',
    },
    draggingNode: undefined,
    focusedNodeId: undefined,
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
  setFocusForRemovedNode: ({ nodeId }) => {
    set((prev) => ({
      entity: setFocusForRemovedNode({ entity: prev.entity, nodeId }),
    }))
  },
  toggleExpandedNode: ({ nodeId }) => {
    set((prev) => ({
      entity: toggleExpandedNode({ entity: prev.entity, nodeId }),
    }))
  },
}))

const useTreeViewStore = <T>(selector: (state: TreeViewStore) => T) =>
  __useTreeViewStore(useShallow(selector))

export default useTreeViewStore
export { getTreeViewNodes, getDraggingNode, isFocus, isExpandedNode } from './index'
