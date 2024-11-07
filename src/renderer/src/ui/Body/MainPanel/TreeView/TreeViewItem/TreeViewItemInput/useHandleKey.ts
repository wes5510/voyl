import { useCallback } from 'react'
import useHandleBackspaceInNode from './useHandleBackspaceInNode'
import useHandleEnterInNode from './useHandleEnterInNode'
import { HotkeyCallback } from 'react-hotkeys-hook'
import { useSetAtom } from 'jotai'
import { updateFocusToNextNodeAtom, updateFocusToPrevNodeAtom } from '@/state/tree.state'

export default function useHandleKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const handelEnter = useHandleEnterInNode({ nodeId })
  const handleBackspace = useHandleBackspaceInNode({ nodeId })
  const updateFocusToPrevNode = useSetAtom(updateFocusToPrevNodeAtom)
  const updateFocusToNextNode = useSetAtom(updateFocusToNextNodeAtom)

  return useCallback(
    (keyEvent, hotKeyEvent) => {
      switch (hotKeyEvent.keys?.join('')) {
        case 'enter': {
          handelEnter(keyEvent, hotKeyEvent)
          break
        }
        case 'backspace': {
          handleBackspace(keyEvent, hotKeyEvent)
          break
        }
        case 'up': {
          updateFocusToPrevNode()
          break
        }
        case 'down': {
          updateFocusToNextNode()
          break
        }
      }
    },
    [handelEnter, handleBackspace, updateFocusToNextNode, updateFocusToPrevNode],
  )
}
