import { useCallback } from 'react'
import { isHTMLTextAreaElement } from './shared/util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import useTreeStore from '@/models/tree'
import useTreeViewStore from '@/models/treeView'

export default function useHandleBackspaceKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const removeNode = useTreeStore((state) => state.removeNode)
  const setFocusForRemovedNode = useTreeViewStore((state) => state.setFocusForRemovedNode)
  return useCallback(
    (e: KeyboardEvent) => {
      if (!isHTMLTextAreaElement(e.target) || e.target.value) {
        return
      }

      removeNode({ nodeId })
      setFocusForRemovedNode({ nodeId })
      e.preventDefault()
    },
    [nodeId, removeNode, setFocusForRemovedNode],
  )
}
