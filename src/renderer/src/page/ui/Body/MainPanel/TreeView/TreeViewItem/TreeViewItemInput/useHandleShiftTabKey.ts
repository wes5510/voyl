import { useCallback } from 'react'
import { isHTMLTextAreaElement } from './util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import { useSetAtom } from 'jotai'
import { outdentNodeAtom } from '@/state/tree.state'

export default function useHandleShiftTabKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const outdentNode = useSetAtom(outdentNodeAtom)

  return useCallback(
    (e: KeyboardEvent) => {
      if (!isHTMLTextAreaElement(e.target)) {
        return
      }

      outdentNode({ nodeId })
      e.preventDefault()
    },
    [outdentNode, nodeId],
  )
}
