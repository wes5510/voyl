import { isHTMLTextAreaElement } from './shared/util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import {
  getPreviousFocusableNodeId,
  useRemoveNode,
  setTreeViewFocusedNodeId,
} from '@/renderer/state/treeView'

export default function useHandleBackspaceKey({
  nodeId,
}: {
  nodeId: string
}): HotkeyCallback {
  const removeNode = useRemoveNode()

  return async (e: KeyboardEvent) => {
    if (!isHTMLTextAreaElement(e.target) || e.target.value) {
      return
    }

    e.preventDefault()

    const previousNodeId = await getPreviousFocusableNodeId({ id: nodeId })
    await removeNode({ nodeId })

    if (previousNodeId) {
      setTreeViewFocusedNodeId({ nodeId: previousNodeId })
    }
  }
}
