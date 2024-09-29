import { hstack } from '@styled-system/patterns'
import { MouseEventHandler } from 'react'
import PlusIcon from '../../../Icon/PlusIcon'

export interface AddButtonProps {
  text: string
  onClick?: MouseEventHandler
}

export default function AddButton({ onClick, text }: AddButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={hstack({
        width: 'fit-content',
        gap: 1,
        cursor: 'pointer',
        _hover: {
          fontWeight: 'semibold'
        }
      })}
    >
      <PlusIcon width="20" height="20" />
      {text}
    </button>
  )
}
