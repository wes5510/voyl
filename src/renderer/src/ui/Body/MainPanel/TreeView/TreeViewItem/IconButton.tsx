import { center } from '@/styled-system/patterns'
import { MouseEventHandler, PropsWithChildren } from 'react'

export interface IconButtonProps extends PropsWithChildren {
  className?: string
  onClick?: MouseEventHandler
}

export default function IconButton({ children, onClick, ...props }: IconButtonProps): JSX.Element {
  return (
    <button
      className={center({
        w: 6,
        h: 6,
        rounded: 'full',
        cursor: 'pointer',
        bg: {
          _hover: 'neutral.200',
        },
        transitionProperty: 'background',
        transitionDuration: 'slow',
      })}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
