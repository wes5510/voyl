import { MouseEventHandler, PropsWithChildren } from 'react'
import { center } from '@styled-system/patterns'
import Tooltip from '../Tooltip'

export interface TooltipButtonProps extends PropsWithChildren {
  text: string
  active?: boolean
  onClick?: MouseEventHandler
}

export default function TooltipButton({
  children,
  text,
  active,
  onClick
}: TooltipButtonProps): JSX.Element {
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
                _hover: 'neutral.200'
              },
          transitionProperty: 'background',
          transitionDuration: 'slow'
        })}
        onClick={onClick}
      >
        {children}
      </button>
    </Tooltip>
  )
}
