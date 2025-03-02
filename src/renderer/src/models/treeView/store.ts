import { create } from 'zustand'
import { setRootNodeId, setFocusedNodeId, TreeViewEntity } from './index'
import useNodeTableStore from '../nodeTable/store'

interface TreeViewStore {
  entity: TreeViewEntity
  setRootNodeId: (rootNodeId: string) => void
  setFocusedNodeId: ({ nodeId }: { nodeId: string }) => void
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
  setFocusedNodeId: ({ nodeId }) => {
    set((state) => ({
      entity: setFocusedNodeId({ entity: state.entity, nodeId }),
    }))
  },
}))

export default useTreeViewStore
export { getTreeViewNodes, getDraggingNode, isFocus } from './index'
