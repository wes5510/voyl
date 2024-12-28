import { create } from 'zustand'
import {
  indentNode,
  insertNewNodeAfter,
  moveNode,
  outdentNode,
  removeNode,
  setCollapsed,
  setFocusedNodeId,
  TreeEntity,
  updateFocusToNextNode,
  updateFocusToPrevNode,
} from './tree'

interface TreeStore extends TreeEntity {
  setFocusedNodeId: ({ nodeId }: { nodeId: string }) => void
  insertNewNodeAfter: ({
    refNodeId,
    newNodeTitle,
  }: {
    refNodeId: string
    newNodeTitle: string
  }) => void
  updateFocusToNextNode: () => void
  updateFocusToPrevNode: () => void
  removeNode: ({ nodeId }: { nodeId: string }) => void
  indentNode: ({ nodeId }: { nodeId: string }) => void
}

const useTreeStore = create<TreeStore>((set) => ({
  nodeIds: ['1'],
  focusedNodeId: '1',
  nodeMap: new Map([
    [
      '1',
      {
        id: '1',
        depth: 0,
        collapsed: false,
        title: '1',
      },
    ],
  ]),
  setFocusedNodeId: ({ nodeId }) => {
    set((state) =>
      setFocusedNodeId({
        entity: state,
        nodeId,
      }),
    )
  },
  insertNewNodeAfter: ({ refNodeId, newNodeTitle }: { refNodeId: string; newNodeTitle: string }) =>
    set((state) =>
      insertNewNodeAfter({
        entity: state,
        refNodeId,
        newNodeTitle,
      }),
    ),
  updateFocusToNextNode: () =>
    set((state) =>
      updateFocusToNextNode({
        entity: state,
      }),
    ),
  updateFocusToPrevNode: () =>
    set((state) =>
      updateFocusToPrevNode({
        entity: state,
      }),
    ),
  removeNode: ({ nodeId }) =>
    set((state) =>
      removeNode({
        entity: state,
        nodeId,
      }),
    ),
  indentNode: ({ nodeId }) =>
    set((state) =>
      indentNode({
        entity: state,
        nodeId,
      }),
    ),
  outdentNode: ({ nodeId }) =>
    set((state) =>
      outdentNode({
        entity: state,
        nodeId,
      }),
    ),
  moveNode: ({ refNodeId, targetNode, deltaDepth }) =>
    set((state) =>
      moveNode({
        entity: state,
        refNodeId,
        targetNode,
        deltaDepth,
      }),
    ),
  setCollapsed: ({ nodeId, collapsed }) =>
    set((state) =>
      setCollapsed({
        entity: state,
        nodeId,
        collapsed,
      }),
    ),
}))

export default useTreeStore
