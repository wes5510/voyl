import { useCallback } from 'react'
import { isHTMLTextAreaElement } from './shared/util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import useTreeStore from '@/models/tree/store'

export default function useHandleShiftTabKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const outdentNode = useTreeStore((state) => state.outdentNode)

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
