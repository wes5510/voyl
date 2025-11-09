import { HotkeyCallback } from 'react-hotkeys-hook'
import useHandleEnterKey from './useHandleEnterKey'

export default function useHandleKey({
  nodeId,
}: {
  nodeId: string
}): HotkeyCallback {
  const handelEnterKey = useHandleEnterKey({ nodeId })

  return (keyEvent, hotKeyEvent) => {
    switch (hotKeyEvent.keys?.join('')) {
      case 'enter': {
        handelEnterKey(keyEvent, hotKeyEvent)
        break
      }
    }
  }
}
