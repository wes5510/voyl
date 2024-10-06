import { useHotkeys } from 'react-hotkeys-hook'
import { css, cx } from '@styled-system/css'
import { useAtom } from 'jotai'
import { ChangeEvent, useRef } from 'react'
import mergeRefs from 'merge-refs'
import { textAtom } from './store'
import useHandleEnterInNode from './hooks/useHandleEnterInNode'
import useSyncFocus from './hooks/useSyncFocus'
import useAutoResize from './hooks/useAutoResize'
import useHandlePasteInNode from './hooks/useHandlePasteInNode'

export interface TreeViewItemInputProps {
  nodeId: string
  className?: string
}

export default function TreeViewItemInput({
  nodeId,
  className
}: TreeViewItemInputProps): JSX.Element {
  const elemRef = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useAtom(textAtom(nodeId))
  const hotkeyRef = useHotkeys<HTMLTextAreaElement>('enter', useHandleEnterInNode({ nodeId }), {
    preventDefault: true,
    enableOnFormTags: ['textarea']
  })
  useSyncFocus({ nodeId, ref: elemRef })
  useAutoResize({ ref: elemRef })

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value)
  }

  return (
    <textarea
      ref={mergeRefs(hotkeyRef, elemRef)}
      value={text}
      onChange={handleChange}
      onPaste={useHandlePasteInNode({ setText })}
      rows={1}
      className={cx(
        css({
          wordBreak: 'break-word',
          outline: 'none',
          resize: 'none'
        }),
        className
      )}
    />
  )
}
