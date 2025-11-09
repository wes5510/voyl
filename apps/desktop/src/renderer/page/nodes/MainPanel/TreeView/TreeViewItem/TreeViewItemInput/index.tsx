import { useHotkeys } from 'react-hotkeys-hook'
import mergeRefs from 'merge-refs'
import { useRef } from 'react'
import { useTreeNodeTitle } from '@/renderer/store/tree'
import useAutoResize from './useAutoResize'
import cn from '@/renderer/common/shared/cn'
import useHandleKey from './useHandleKey'
import useFocus from './useFocus'

export interface TreeViewItemInputProps {
  nodeId: string
  className?: string
}

export default function TreeViewItemInput({
  nodeId,
  className,
}: TreeViewItemInputProps) {
  const elemRef = useRef<HTMLTextAreaElement>(null)
  const title = useTreeNodeTitle({ nodeId })
  const keyRef = useHotkeys<HTMLTextAreaElement>(
    ['enter', 'backspace', 'up', 'down', 'tab', 'shift+tab'],
    useHandleKey({ nodeId }),
    {
      enableOnFormTags: ['textarea'],
      preventDefault: (_e, hotKeyEvent) => {
        const keys = hotKeyEvent.keys?.join('')
        return keys === 'enter' || keys === 'up'
      },
    },
  )

  useAutoResize({ ref: elemRef })
  const handleFocus = useFocus({ nodeId, ref: elemRef })

  return (
    <textarea
      ref={mergeRefs(keyRef, elemRef)}
      value={title}
      rows={1}
      onFocus={handleFocus}
      className={cn(
        'word-break-break-word resize-none outline-none',
        className,
      )}
    />
  )
}
