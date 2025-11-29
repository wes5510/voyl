import { TreeViewEntity } from '@/renderer/model/treeView'
import { proxy } from 'valtio'

/**
 * TreeView Valtio State
 */
export const treeViewState = proxy<TreeViewEntity>({
  expandedNodeIds: [],
  topNodeId: undefined,
  focusedNodeId: undefined,
  draggingNode: undefined,
})