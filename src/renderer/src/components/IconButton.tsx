import { MouseEventHandler, ReactNode } from 'react'
import { center } from '@styled-system/patterns'

export interface IconButtonProps {
  icon: ReactNode
  active?: boolean
  onClick?: MouseEventHandler
}

export default function IconButton({ icon, active, onClick }: IconButtonProps): JSX.Element {
  return (
    <button
      className={center({
        w: 10,
        h: 10,
        cursor: 'pointer',
        bg: active
          ? 'zinc.200'
          : {
              _hover: 'zinc.100'
            }
      })}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}
