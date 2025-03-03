import { create } from 'zustand'
import {
  setTitleByNodeId,
  insertNewNodeAfter,
  TreeEntity,
  removeNodeByNodeId,
  outdentNode,
  indentNode,
} from './index'
import { NodeEntityId } from './node'
import { useShallow } from 'zustand/react/shallow'

interface TreeStore {
  entity: TreeEntity
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
    nested: boolean
  }) => NodeEntityId | undefined
  removeNode: ({ nodeId }: { nodeId: string }) => void
  outdentNode: ({ nodeId }: { nodeId: string }) => void
  indentNode: ({ nodeId }: { nodeId: string }) => void
}

const __useTreeStore = create<TreeStore>((set, get) => ({
  entity: {
    rootNodeId: 'n-1',
    nodeTable: new Map([
      [
        'n-1',
        {
          id: 'n-1',
          prevSiblingNodeId: undefined,
          nextSiblingNodeId: undefined,
          parentNodeId: undefined,
          childNodeIds: ['n-2'],
          collapsed: false,
          task: {
            id: 'task-1',
            title: 'task-1',
            done: false,
          },
        },
      ],
      [
        'n-2',
        {
          id: 'n-2',
          prevSiblingNodeId: undefined,
          nextSiblingNodeId: undefined,
          parentNodeId: 'n-1',
          childNodeIds: [],
          collapsed: true,
          task: {
            id: 'task-2',
            title: 'task-2',
            done: false,
          },
        },
      ],
    ]),
  },
  setTitleByNodeId: ({ nodeId, title }: { nodeId: string; title: string }) => {
    set((prev) => ({
      entity: setTitleByNodeId({ entity: prev.entity, nodeId, title }),
    }))
  },
  insertNewNodeAfter: ({ sourceNode, newNodeTitle, nested }) => {
    const { entity: newEntity, newNode } = insertNewNodeAfter({
      entity: get().entity,
      sourceNode,
      newNodeTitle,
      nested,
    })

    set({ entity: newEntity })

    return newNode?.id
  },
  removeNode: ({ nodeId }: { nodeId: string }) => {
    set((prev) => ({
      entity: removeNodeByNodeId({ entity: prev.entity, nodeId }),
    }))
  },
  outdentNode: ({ nodeId }: { nodeId: string }) => {
    set((prev) => ({
      entity: outdentNode({ entity: prev.entity, nodeId }),
    }))
  },
  indentNode: ({ nodeId }: { nodeId: string }) => {
    set((prev) => ({
      entity: indentNode({ entity: prev.entity, nodeId }),
    }))
  },
}))

const useTreeStore = <T>(selector: (state: TreeStore) => T) => __useTreeStore(useShallow(selector))

export default useTreeStore
export type { NodeEntity, NodeEntityId } from './node'
export { getNode } from './nodeTable'
export type { NodeTableEntity } from './nodeTable'
export { getTitleByNodeId, getNodeTable, getRootNodeId, getChildNodeIdsByNodeId } from './index'
