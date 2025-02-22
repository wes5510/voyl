import { useCallback } from 'react'
import { isHTMLTextAreaElement } from './util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import useTreeStore from '@/features/__tree/model'

export default function useHandleTabKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const indentNode = useTreeStore((state) => state.indentNode)

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
