import { TreeViewEntity ,
  setTopNodeId,
  setFocusedNodeId,
} from '@/renderer/model/treeView'
import { proxy } from 'valtio'

/**
 * TreeView Valtio Store
 */
export const treeViewStore = proxy<TreeViewEntity>({
  expandedNodeIds: [],
  topNodeId: undefined,
  focusedNodeId: undefined,
  draggingNode: undefined,
})

/**
 * Top Node ID 설정
 */
export const setTreeViewTopNodeId = ({ topNodeId }: { topNodeId: string }) => {
  const updated = setTopNodeId({ entity: treeViewStore, topNodeId })
  treeViewStore.topNodeId = updated.topNodeId
}

/**
 * Focused Node ID 설정
 */
export const setTreeViewFocusedNodeId = ({ nodeId }: { nodeId: string }) => {
  const updated = setFocusedNodeId({ entity: treeViewStore, nodeId })
  treeViewStore.focusedNodeId = updated.focusedNodeId
}