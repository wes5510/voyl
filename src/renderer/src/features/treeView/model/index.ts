import { create } from 'zustand'
import {
  insertNewNodeAfter,
  moveNode,
  removeNode,
  setFocusedNodeId,
  setFocusToNextNode,
  setFocusToPrevNode,
  TreeViewEntity,
} from './treeView'

interface TreeViewStore {
  entity: TreeViewEntity
  setFocusedNodeId: ({ nodeId }: { nodeId: string }) => void
  setFocusToNextNode: () => void
  setFocusToPrevNode: () => void
  insertNewNodeAfter: ({ refNodeId, newNodeId }: { refNodeId: string; newNodeId: string }) => void
  removeNode: ({ nodeId }: { nodeId: string }) => void
  moveNode: ({ refNodeId, targetNodeId }: { refNodeId: string; targetNodeId: string }) => void
}

const useTreeViewStore = create<TreeViewStore>((set) => ({
  entity: {
    rootNodeId: '1',
    focusedNodeId: '1',
    visibleNodeIds: ['1'],
  },
  setFocusedNodeId: ({ nodeId }) => {
    set((state) => ({
      entity: setFocusedNodeId({
        entity: state.entity,
        nodeId,
      }),
    }))
  },
  setFocusToNextNode: () => {
    set((state) => ({
      entity: setFocusToNextNode({
        entity: state.entity,
      }),
    }))
  },
  setFocusToPrevNode: () => {
    set((state) => ({
      entity: setFocusToPrevNode({
        entity: state.entity,
      }),
    }))
  },
  insertNewNodeAfter: ({ refNodeId, newNodeId }) => {
    set((state) => ({
      entity: insertNewNodeAfter({
        refNodeId,
        newNodeId,
        entity: state.entity,
      }),
    }))
  },
  removeNode: ({ nodeId }) => {
    set((state) => ({
      entity: removeNode({
        entity: state.entity,
        nodeId,
      }),
    }))
  },
  moveNode: ({ refNodeId, targetNodeId }) => {
    set((state) => ({
      entity: moveNode({
        entity: state.entity,
        refNodeId,
        targetNodeId,
      }),
    }))
  },
}))

export default useTreeViewStore
