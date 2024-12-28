import { useCallback } from 'react'
import useHandleBackspaceKey from './useHandleBackspaceKey'
import useHandleEnterKey from './useHandleEnterKey'
import { HotkeyCallback } from 'react-hotkeys-hook'
import useHandleTabKey from './useHandleTabKey'
import useHandleShiftTabKey from './useHandleShiftTabKey'
import useTreeStore from '@/features/tree/model'

export default function useHandleKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const handelEnterKey = useHandleEnterKey({ nodeId })
  const handleBackspaceKey = useHandleBackspaceKey({ nodeId })
  const { updateFocusToPrevNode, updateFocusToNextNode } = useTreeStore((state) => ({
    updateFocusToPrevNode: state.updateFocusToPrevNode,
    updateFocusToNextNode: state.updateFocusToNextNode,
  }))
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
