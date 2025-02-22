import { useCallback } from 'react'
import { isHTMLTextAreaElement } from './util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import useTreeStore from '@/features/__tree/model'

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
