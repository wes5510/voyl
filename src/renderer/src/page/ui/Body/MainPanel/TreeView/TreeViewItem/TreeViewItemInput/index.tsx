import { useHotkeys } from 'react-hotkeys-hook'
import { css, cx } from '@/styled-system/css'
import { useAtom } from 'jotai'
import { ChangeEvent, useRef } from 'react'
import mergeRefs from 'merge-refs'
import useSyncFocus from './useSyncFocus'
import useAutoResize from './useAutoResize'
import useHandlePaste from './useHandlePaste'
import { titleAtom } from '@/state/node.state'
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
  const [title, setTitle] = useAtom(titleAtom(nodeId))
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
  const handleFocus = useSyncFocus({ nodeId, ref: elemRef })
  const handlePaste = useHandlePaste({ nodeId: nodeId })

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setTitle(e.target.value)
  }

  return (
    <textarea
      ref={mergeRefs(keyRef, elemRef)}
      value={title}
      onChange={handleChange}
      onPaste={handlePaste}
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
