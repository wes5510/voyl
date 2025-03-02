import { useCallback } from 'react'
import useHandleBackspaceKey from './useHandleBackspaceKey'
import useHandleEnterKey from './useHandleEnterKey'
import { HotkeyCallback } from 'react-hotkeys-hook'
import useHandleTabKey from './useHandleTabKey'
import useHandleShiftTabKey from './useHandleShiftTabKey'
import useTreeViewStore from '@/models/treeView'

export default function useHandleKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const handelEnterKey = useHandleEnterKey({ nodeId })
  const handleBackspaceKey = useHandleBackspaceKey({ nodeId })
  const { setFocusToPrevNode, setFocusToNextNode } = useTreeViewStore((state) => ({
    setFocusToPrevNode: state.setFocusToPrevNode,
    setFocusToNextNode: state.setFocusToNextNode,
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
          setFocusToPrevNode()
          break
        }
        case 'down': {
          setFocusToNextNode()
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
      setFocusToNextNode,
      setFocusToPrevNode,
    ],
  )
}
