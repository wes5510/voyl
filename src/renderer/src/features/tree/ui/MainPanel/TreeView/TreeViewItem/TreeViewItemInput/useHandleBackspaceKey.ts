import { useCallback } from 'react'
import { isHTMLTextAreaElement } from './util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import useTreeStore from '@/features/tree/model'

export default function useHandleBackspaceKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const removeNode = useTreeStore((state) => state.removeNode)

  return useCallback(
    (e: KeyboardEvent) => {
      if (!isHTMLTextAreaElement(e.target) || e.target.value) {
        return
      }

      removeNode({ nodeId })
      e.preventDefault()
    },
    [nodeId, removeNode],
  )
}
