import { useCallback } from 'react'
import useHandleBackspaceKey from './useHandleBackspaceKey'
import useHandleEnterKey from './useHandleEnterKey'
import { HotkeyCallback } from 'react-hotkeys-hook'
import { useSetAtom } from 'jotai'
import { updateFocusToNextNodeAtom, updateFocusToPrevNodeAtom } from '@/state/tree.state'
import useHandleTabKey from './useHandleTabKey'
import useHandleShiftTabKey from './useHandleShiftTabKey'

export default function useHandleKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const handelEnterKey = useHandleEnterKey({ nodeId })
  const handleBackspaceKey = useHandleBackspaceKey({ nodeId })
  const updateFocusToPrevNode = useSetAtom(updateFocusToPrevNodeAtom)
  const updateFocusToNextNode = useSetAtom(updateFocusToNextNodeAtom)
  const handleTabKey = useHandleTabKey({ nodeId })
  const handleShiftTabKey = useHandleShiftTabKey({ nodeId })

  return useCallback(
    (keyEvent, hotKeyEvent) => {
      switch (hotKeyEvent.keys?.join('')) {
        case 'enter': {
          handelEnterKey(keyEvent, hotKeyEvent)
          break
        }
        case 'backspace': {
          handleBackspaceKey(keyEvent, hotKeyEvent)
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
        case 'tab': {
          if (hotKeyEvent.shift) {
            handleShiftTabKey(keyEvent, hotKeyEvent)
          } else {
            handleTabKey(keyEvent, hotKeyEvent)
          }
          break
        }
      }
    },
    [
      handelEnterKey,
      handleBackspaceKey,
      handleShiftTabKey,
      handleTabKey,
      updateFocusToNextNode,
      updateFocusToPrevNode,
    ],
  )
}
