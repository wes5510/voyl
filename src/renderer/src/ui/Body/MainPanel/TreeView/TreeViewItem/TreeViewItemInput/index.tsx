import { useHotkeys } from 'react-hotkeys-hook'
import { css, cx } from '@/styled-system/css'
import { useAtom } from 'jotai'
import { ChangeEvent, useRef } from 'react'
import mergeRefs from 'merge-refs'
import useSyncFocus from './useSyncFocus'
import useAutoResize from './useAutoResize'
import useHandlePasteInNode from './useHandlePasteInNode'
import { textAtom } from '@/state/node.state'
import useHandleKey from './useHandleKey'

export interface TreeViewItemInputProps {
  nodeId: string
  className?: string
}

export default function TreeViewItemInput({
  nodeId,
  className,
}: TreeViewItemInputProps): JSX.Element {
  const elemRef = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useAtom(textAtom(nodeId))
  const keyRef = useHotkeys<HTMLTextAreaElement>(
    ['enter', 'backspace', 'up', 'down'],
    useHandleKey({ nodeId }),
    {
      enableOnFormTags: ['textarea'],
      preventDefault: (_e, hotKeyEvent) => {
        const keys = hotKeyEvent.keys?.join('')
        return keys === 'enter' || keys === 'up'
      },
    },
  )
  const handleFocus = useSyncFocus({ nodeId, ref: elemRef })
  useAutoResize({ ref: elemRef })

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value)
  }

  return (
    <textarea
      ref={mergeRefs(keyRef, elemRef)}
      value={text}
      onChange={handleChange}
      onPaste={useHandlePasteInNode({ setText })}
      rows={1}
      onFocus={handleFocus}
      className={cx(
        css({
          wordBreak: 'break-word',
          outline: 'none',
          resize: 'none',
        }),
        className,
      )}
    />
  )
}
