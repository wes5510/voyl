import { useCallback } from 'react'
import { isHTMLTextAreaElement } from './util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import { useSetAtom } from 'jotai'
import { removeNodeAtom } from '@/features/tree/model/tree'

export default function useHandleBackspaceKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const removeNode = useSetAtom(removeNodeAtom)

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
