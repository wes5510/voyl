import { MouseEventHandler, PropsWithChildren } from 'react'
import { center } from '@styled-system/patterns'
import Tooltip from '../Tooltip'

export interface OneButtonProps extends PropsWithChildren {
  text: string
  active?: boolean
  onClick?: MouseEventHandler
}

export default function OneButton({
  children,
  text,
  active,
  onClick
}: OneButtonProps): JSX.Element {
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
        {children}
      </button>
    </Tooltip>
  )
}
