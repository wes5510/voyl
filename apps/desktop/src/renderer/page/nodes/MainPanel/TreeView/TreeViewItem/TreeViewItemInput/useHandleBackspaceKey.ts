import { isHTMLTextAreaElement } from './shared/util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import { useRemoveNode } from '@/renderer/store/treeView'

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
    await removeNode({ nodeId })
  }
}
