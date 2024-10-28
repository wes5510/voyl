import { useCallback } from 'react'
import { isHTMLTextAreaElement } from './util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import { useSetAtom } from 'jotai'
import { removeNodeInTreeAtom } from '@/src/renderer/src/state/tree.state'

export default function useHandleBackspaceInNode({ nodeId }: { nodeId: string }): HotkeyCallback {
  const removeNodeInTree = useSetAtom(removeNodeInTreeAtom)

  return useCallback(
    (e: KeyboardEvent) => {
      if (!isHTMLTextAreaElement(e.target) || e.target.value) {
        return
      }

      removeNodeInTree({ nodeId })
      e.preventDefault()
    },
    [nodeId, removeNodeInTree],
  )
}
