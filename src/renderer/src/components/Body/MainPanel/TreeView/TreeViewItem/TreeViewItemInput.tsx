import { useHotkeys } from 'react-hotkeys-hook'
import { css, cx } from '@styled-system/css'
import { useAtom } from 'jotai'
import { textAtom } from './store'
import useHandleEnterInNode from './useHandleEnterInNode'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { mergeRefs } from 'react-merge-refs'
import useSyncFocus from './useSyncFocus'

export interface TreeViewItemInputProps {
  nodeId: string
  className?: string
}

export default function TreeViewItemInput({
  nodeId,
  className
}: TreeViewItemInputProps): JSX.Element {
  const [text, setText] = useAtom(textAtom(nodeId))
  const handleEnter = useHandleEnterInNode({ nodeId })
  const hotkeyRef = useHotkeys<HTMLDivElement>('enter', handleEnter, {
    enableOnContentEditable: true,
    preventDefault: true
  })
  const syncFocusRef = useSyncFocus<HTMLDivElement>({ nodeId })

  const handleChange = (ev: ContentEditableEvent): void => {
    setText(ev.target.value)
  }

  return (
    <ContentEditable
      innerRef={mergeRefs([hotkeyRef, syncFocusRef])}
      html={text}
      onChange={handleChange}
      className={cx(
        css({
          wordBreak: 'break-word',
          outline: 'none'
        }),
        className
      )}
    />
  )
}
