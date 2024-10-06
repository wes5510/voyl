import { useHotkeys } from 'react-hotkeys-hook'
import { css, cx } from '@styled-system/css'
import { useAtom } from 'jotai'
import { textAtom } from './store'
import useHandleEnterInNode from './useHandleEnterInNode'
import mergeRefs from 'merge-refs'
import useSyncFocus from './useSyncFocus'
import { ChangeEvent, useRef } from 'react'
import useAutoResize from './useAutoResize'

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
  const handleEnter = useHandleEnterInNode({ nodeId })
  const hotkeyRef = useHotkeys<HTMLTextAreaElement>('enter', handleEnter, {
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
