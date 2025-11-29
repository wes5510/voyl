import {
  setTopNodeId,
  setFocusedNodeId,
} from '@/renderer/model/treeView'
import { treeViewState } from './state'

/**
 * Top Node ID 설정
 */
export const setTreeViewTopNodeId = ({ topNodeId }: { topNodeId: string }) => {
  const updated = setTopNodeId({ entity: treeViewState, topNodeId })
  treeViewState.topNodeId = updated.topNodeId
}

/**
 * Focused Node ID 설정
 */
export const setTreeViewFocusedNodeId = ({ nodeId }: { nodeId: string }) => {
  const updated = setFocusedNodeId({ entity: treeViewState, nodeId })
  treeViewState.focusedNodeId = updated.focusedNodeId
}