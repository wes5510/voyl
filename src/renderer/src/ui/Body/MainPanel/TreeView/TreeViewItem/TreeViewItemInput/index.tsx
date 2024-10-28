import { useHotkeys } from 'react-hotkeys-hook'
import { css, cx } from '@/styled-system/css'
import { useAtom } from 'jotai'
import { ChangeEvent, useRef } from 'react'
import mergeRefs from 'merge-refs'
import useHandleEnterInNode from './useHandleEnterInNode'
import useSyncFocus from './useSyncFocus'
import useAutoResize from './useAutoResize'
import useHandlePasteInNode from './useHandlePasteInNode'
import { textAtom } from '@/src/renderer/src/state/node.state'
import useHandleBackspaceInNode from './useHandleBackspaceInNode'

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
  const enterKeyRef = useHotkeys<HTMLTextAreaElement>('enter', useHandleEnterInNode({ nodeId }), {
    preventDefault: true,
    enableOnFormTags: ['textarea'],
  })
  const backspaceKeyRef = useHotkeys<HTMLTextAreaElement>(
    'backspace',
    useHandleBackspaceInNode({ nodeId }),
    {
      enableOnFormTags: ['textarea'],
    },
  )
  const handleFocus = useSyncFocus({ nodeId, ref: elemRef })
  useAutoResize({ ref: elemRef })

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value)
  }

  return (
    <textarea
      ref={mergeRefs(enterKeyRef, backspaceKeyRef, elemRef)}
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
