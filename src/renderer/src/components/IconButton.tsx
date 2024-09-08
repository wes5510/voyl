import { MouseEventHandler, ReactNode } from 'react'
import { center } from '@styled-system/patterns'
import Tooltip from './Tooltip'

export interface IconButtonProps {
  icon: ReactNode
  text: string
  active?: boolean
  onClick?: MouseEventHandler
}

export default function IconButton({ icon, text, active, onClick }: IconButtonProps): JSX.Element {
  return (
    <Tooltip text={text}>
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
    </Tooltip>
  )
}
