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
  setDraggingNode,
  moveDraggingNode,
  getDraggingNodeParentId,
  getCountChildBetweenNodes,
  resetDraggingNode,
} from './index'
import { NodeTable } from './flattenedTree'
import { useShallow } from 'zustand/react/shallow'

interface TreeViewStore {
  entity: TreeViewEntity
  setRootNodeId: ({ rootNodeId, nodeTable }: { rootNodeId: string; nodeTable: NodeTable }) => void
  setFocusedNodeId: ({ nodeId }: { nodeId?: string }) => void
  setFocusToPrevNode: () => void
  setFocusToNextNode: () => void
  setFocusForRemovedNode: ({ nodeId }: { nodeId: string }) => void
  toggleExpandedNode: ({ nodeId, nodeTable }: { nodeId: string; nodeTable: NodeTable }) => void
  expandNode: ({ nodeId, nodeTable }: { nodeId: string; nodeTable: NodeTable }) => void
  setDraggingNode: ({ nodeId, nodeTable }: { nodeId?: string; nodeTable: NodeTable }) => void
  moveDraggingNode: ({ overNodeId, deltaDepth }: { overNodeId: string; deltaDepth: number }) => void
  getDraggingNodeParentId: ({ overNodeId }: { overNodeId: string }) => string | undefined
  getCountChildBetweenNodes: ({
    parentNodeId,
    nodeId,
  }: {
    parentNodeId: string
    nodeId: string
  }) => number
  resetDraggingNode: ({ nodeTable }: { nodeTable: NodeTable }) => void
}

const __useTreeViewStore = create<TreeViewStore>((set, get) => ({
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
  setDraggingNode: ({ nodeId, nodeTable }) => {
    set((prev) => ({
      entity: setDraggingNode({ entity: prev.entity, nodeId, nodeTable }),
    }))
  },
  resetDraggingNode: ({ nodeTable }) => {
    set((prev) => ({
      entity: resetDraggingNode({ entity: prev.entity, nodeTable }),
    }))
  },
  moveDraggingNode: ({ overNodeId, deltaDepth }) => {
    set((prev) => ({
      entity: moveDraggingNode({ entity: prev.entity, overNodeId, deltaDepth }),
    }))
  },
  getDraggingNodeParentId: ({ overNodeId }) =>
    getDraggingNodeParentId({ entity: get().entity, overNodeId }),
  getCountChildBetweenNodes: ({ parentNodeId, nodeId }) =>
    getCountChildBetweenNodes({ entity: get().entity, parentNodeId, nodeId }),
}))

const useTreeViewStore = <T>(selector: (state: TreeViewStore) => T) =>
  __useTreeViewStore(useShallow(selector))

export default useTreeViewStore
export { getTreeViewNodes, getDraggingNode, isFocus, isExpandedNode, getNodeDepth } from './index'
