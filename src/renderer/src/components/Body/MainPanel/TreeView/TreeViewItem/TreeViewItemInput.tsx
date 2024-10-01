import { css, cx } from '@styled-system/css'
import { useMemo } from 'react'

export interface TreeViewItemInputProps {
  initialValue: string
  onChangeValue: (value: string) => void
  className?: string
}
export default function TreeViewItemInput({
  initialValue,
  onChangeValue,
  className
}: TreeViewItemInputProps): JSX.Element {
  const _initialValue = useMemo(() => initialValue, [])
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  const onInput = (event: React.FormEvent<HTMLDivElement>): void => {
    onChangeValue(event.currentTarget.textContent ?? '')
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
      {_initialValue}
    </div>
  )
}
