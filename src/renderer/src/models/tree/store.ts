import { create } from 'zustand'
import { toggleCollapsedByNodeId, setTitleByNodeId, insertNewNodeAfter, TreeEntity } from './index'
import { NodeEntity } from './node'

interface TreeStore {
  entity: TreeEntity
  toggleCollapsed: ({ nodeId }: { nodeId: string }) => void
  setTitleByNodeId: ({ nodeId, title }: { nodeId: string; title: string }) => void
  insertNewNodeAfter: ({
    sourceNode,
    newNodeTitle,
  }: {
    sourceNode: {
      id: string
      title: string
    }
    newNodeTitle: string
  }) => NodeEntity['id'] | undefined
}

const useTreeStore = create<TreeStore>((set, get) => ({
  entity: {
    nodeTable: new Map([
      [
        '1',
        {
          id: 'node-1',
          prevSiblingNodeId: undefined,
          nextSiblingNodeId: undefined,
          parentNodeId: undefined,
          childNodeIds: [],
          collapsed: false,
          task: {
            id: 'task-1',
            title: 'test',
            done: false,
          },
        },
      ],
    ]),
  },
  toggleCollapsed: ({ nodeId }: { nodeId: string }) => {
    set((prev) => ({
      entity: toggleCollapsedByNodeId({
        entity: prev.entity,
        nodeId,
      }),
    }))
  },
  setTitleByNodeId: ({ nodeId, title }: { nodeId: string; title: string }) => {
    set((prev) => ({
      entity: setTitleByNodeId({ entity: prev.entity, nodeId, title }),
    }))
  },
  insertNewNodeAfter: ({ sourceNode, newNodeTitle }) => {
    const { entity: newEntity, newNode } = insertNewNodeAfter({
      entity: get().entity,
      sourceNode,
      newNodeTitle,
    })

    set({ entity: newEntity })

    return newNode?.id
  },
}))

export default useTreeStore
export type { NodeEntity } from './node'
export type { NodeTableEntity } from './nodeTable'
export { getCollapsedByNodeId, getTitleByNodeId, getNodeTable } from './index'
