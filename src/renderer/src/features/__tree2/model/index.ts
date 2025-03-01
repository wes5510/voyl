import { create } from 'zustand'
import { insertNewNodeAfter, removeNode, TreeEntity } from './tree'

interface TreeStore {
  entity: TreeEntity
  insertNewNodeAfter: ({
    refNodeId,
    newNodeTitle,
  }: {
    refNodeId: string
    newNodeTitle: string
  }) => void
  removeNode: ({ nodeId }: { nodeId: string }) => void
}

const TreeStore = create<TreeStore>((set) => ({
  entity: {
    nodeMap: new Map([
      [
        '1',
        {
          id: '1',
          parentId: '1',
          childrenIds: [],
          depth: 0,
          collapsed: false,
          index: 0,
          task: {
            title: 'Task 1',
            done: false,
          },
        },
      ],
    ]),
  },
  insertNewNodeAfter: ({
    refNodeId,
    newNodeTitle,
  }: {
    refNodeId: string
    newNodeTitle: string
  }) => {
    set((state) => ({
      entity: insertNewNodeAfter({ entity: state.entity, refNodeId, newNodeTitle }),
    }))
  },
  removeNode: ({ nodeId }: { nodeId: string }) => {
    set((state) => ({
      entity: removeNode({ entity: state.entity, nodeId }),
    }))
  },
}))

export default TreeStore
