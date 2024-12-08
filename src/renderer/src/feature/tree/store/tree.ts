import { create } from 'zustand'
import {
  updateFocusToNextNode,
  isFocusedNode,
  insertNewNodeAfter,
  TreeModel,
  setNodeIds,
} from '@/feature/tree/model/tree'

interface TreeStore extends TreeModel {
  setNodeIds: ({ nodeIds }: { nodeIds: string[] }) => void
  isFocusedNode: (nodeId: string) => boolean
  insertNewNodeAfter: ({ refNodeId, newTitle }: { refNodeId: string; newTitle: string }) => void
  updateFocusToNextNode: () => void
}

const useTreeStore = create<TreeStore>((set, get) => ({
  nodeIds: ['1'],
  nodeTable: new Map(),
  focusManager: {
    focusedNodeId: '1',
  },
  setNodeIds: ({ nodeIds }): void => {
    set((prev) => setNodeIds({ tree: prev, nodeIds }))
  },
  isFocusedNode: (nodeId: string): boolean =>
    isFocusedNode({ focusedNodeId: get().focusManager.focusedNodeId, nodeId }),
  insertNewNodeAfter: ({ refNodeId, newTitle }): void => {
    set((prev) =>
      insertNewNodeAfter({
        nodeIds: prev.nodeIds,
        nodeTable: prev.nodeTable,
        refNodeId,
        newTitle,
      }),
    )
  },
  updateFocusToNextNode: (): void => {
    set((prev) => ({
      focusManager: updateFocusToNextNode({
        nodeIds: prev.nodeIds,
        focusedNodeId: prev.focusManager.focusedNodeId,
      }),
    }))
  },
}))

export default useTreeStore
