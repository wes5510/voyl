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
  setNodeTitle,
  setNode,
  getNodeDepth,
  isFocused,
  getNodeTitle,
  getCollapsed,
} from './tree'
import { NodeEntity } from './tree/node'

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
  outdentNode: ({ nodeId }: { nodeId: string }) => void
  moveNode: ({
    refNodeId,
    targetNodeId,
    deltaDepth,
  }: {
    refNodeId: string
    targetNodeId: string
    deltaDepth: number
  }) => void
  setCollapsed: ({ nodeId, collapsed }: { nodeId: string; collapsed: boolean }) => void
  setNodeTitle: ({ nodeId, title }: { nodeId: string; title: string }) => void
  setNodeIds: (nodeIds: string[]) => void
  setNode: ({ node }: { node: NodeEntity }) => void
  getNode: ({ nodeId }: { nodeId: string }) => NodeEntity | undefined
}

const useTreeStore = create<TreeStore>((set, get) => ({
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
  moveNode: ({ refNodeId, targetNodeId, deltaDepth }) =>
    set((state) =>
      moveNode({
        entity: state,
        refNodeId,
        targetNodeId,
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
  setNodeTitle: ({ nodeId, title }) =>
    set((state) =>
      setNodeTitle({
        entity: state,
        nodeId,
        title,
      }),
    ),
  setNodeIds: (nodeIds) => set((state) => ({ ...state, nodeIds })),
  setNode: ({ node }) => set((state) => setNode({ entity: state, node })),
  getNode: ({ nodeId }) => get().nodeMap.get(nodeId),
}))

export default useTreeStore
export { NodeEntity, getNodeDepth, isFocused, getNodeTitle, getCollapsed }
