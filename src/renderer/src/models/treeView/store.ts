import { create } from 'zustand'
import { setRootNodeId, TreeViewEntity } from './index'
import useNodeTableStore from '../nodeTable/store'

interface TreeViewStore {
  entity: TreeViewEntity
  setRootNodeId: (rootNodeId: string) => void
}

const useTreeViewStore = create<TreeViewStore>((set) => ({
  entity: {
    nodes: [],
    draggingNode: undefined,
    focusedNodeId: undefined,
    rootNodeId: '1',
  },
  setRootNodeId: (rootNodeId) => {
    const nodeTable = useNodeTableStore.getState().entity.nodeTable

    set((state) => ({
      entity: setRootNodeId({ entity: state.entity, rootNodeId, nodeTable }),
    }))
  },
}))

export default useTreeViewStore
export { getTreeViewNodes, getDraggingNode } from './index'
