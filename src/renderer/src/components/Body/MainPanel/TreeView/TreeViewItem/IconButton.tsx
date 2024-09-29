import { center } from '@styled-system/patterns'
import { MouseEventHandler, PropsWithChildren } from 'react'

export interface IconButtonProps extends PropsWithChildren {
  className?: string
  onClick?: MouseEventHandler
}

export default function IconButton({ children, onClick }: IconButtonProps): JSX.Element {
  return (
    <button
      className={center({
        w: 6,
        h: 6,
        rounded: 'full',
        cursor: 'pointer',
        bg: {
          _hover: 'neutral.200'
        }
      })}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
