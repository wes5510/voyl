import { HotkeyCallback } from 'react-hotkeys-hook'
import useHandleEnterKey from './useHandleEnterKey'
import useHandleBackspaceKey from './useHandleBackspaceKey'

export default function useHandleKey({
  nodeId,
}: {
  nodeId: string
}): HotkeyCallback {
  const handelEnterKey = useHandleEnterKey({ nodeId })
  const handleBackspaceKey = useHandleBackspaceKey({ nodeId })

  return (keyEvent, hotKeyEvent) => {
    switch (hotKeyEvent.keys?.join('')) {
      case 'enter': {
        handelEnterKey(keyEvent, hotKeyEvent)
        break
      }
      case 'backspace': {
        handleBackspaceKey(keyEvent, hotKeyEvent)
        break
      }
    }
  }
}
