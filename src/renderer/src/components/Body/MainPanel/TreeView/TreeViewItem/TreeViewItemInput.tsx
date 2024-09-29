import { css, cx } from '@styled-system/css'
import { FormEventHandler } from 'react'

export interface TreeViewItemInputProps {
  value?: string
  onInput?: FormEventHandler<HTMLDivElement>
  className?: string
}
export default function TreeViewItemInput({
  value,
  onInput,
  className
}: TreeViewItemInputProps): JSX.Element {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
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
      {value}
    </div>
  )
}
