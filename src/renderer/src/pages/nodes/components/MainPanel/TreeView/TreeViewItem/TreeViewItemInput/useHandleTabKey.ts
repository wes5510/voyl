import { useCallback } from 'react'
import { isHTMLTextAreaElement } from './util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import { useSetAtom } from 'jotai'
import { indentNodeAtom } from '@/features/tree/model/tree'

export default function useHandleTabKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const indentNode = useSetAtom(indentNodeAtom)

  return useCallback(
    (e: KeyboardEvent) => {
      if (!isHTMLTextAreaElement(e.target)) {
        return
      }

      indentNode({ nodeId })
      e.preventDefault()
    },
    [nodeId, indentNode],
  )
}
