import { css, cx } from '@styled-system/css'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { textAtom } from './store'

export interface TreeViewItemInputProps {
  nodeId: string
  className?: string
}
export default function TreeViewItemInput({
  nodeId,
  className
}: TreeViewItemInputProps): JSX.Element {
  const [text, setText] = useAtom(textAtom(nodeId))
  const initialValue = useMemo(() => text, [])
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  const onInput = (event: React.FormEvent<HTMLDivElement>): void => {
    setText(event.currentTarget.textContent ?? '')
  }

  return (
    <div
      contentEditable="true"
      onInput={onInput}
      onKeyDown={handleKeyDown}
      className={cx(
        css({
          wordBreak: 'break-word',
          outline: 'none'
        }),
        className
      )}
    >
      {initialValue}
    </div>
  )
}
