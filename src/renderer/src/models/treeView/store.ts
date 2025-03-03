import { create } from 'zustand'
import {
  setRootNodeId,
  setFocusedNodeId,
  TreeViewEntity,
  setFocusToPrevNode,
  setFocusToNextNode,
  setFocusForRemovedNode,
  toggleExpandedNode,
  expandNode,
} from './index'
import { NodeTableEntity, rawUseTreeStore } from '../tree/store'
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
  toggleExpandedNode: ({
    nodeId,
    nodeTable,
  }: {
    nodeId: string
    nodeTable: NodeTableEntity
  }) => void
  expandNode: ({ nodeId, nodeTable }: { nodeId: string; nodeTable: NodeTableEntity }) => void
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
  toggleExpandedNode: ({ nodeId, nodeTable }) => {
    set((prev) => ({
      entity: toggleExpandedNode({ entity: prev.entity, nodeId, nodeTable }),
    }))
  },
  expandNode: ({ nodeId, nodeTable }) => {
    set((prev) => ({
      entity: expandNode({
        entity: prev.entity,
        nodeId,
        nodeTable,
      }),
    }))
  },
}))

const useTreeViewStore = <T>(selector: (state: TreeViewStore) => T) =>
  __useTreeViewStore(useShallow(selector))

export default useTreeViewStore
export { getTreeViewNodes, getDraggingNode, isFocus, isExpandedNode } from './index'
