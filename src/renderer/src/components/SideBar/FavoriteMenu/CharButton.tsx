import { MouseEventHandler } from 'react'
import TooltipButton from '../TooltipButton'
import { css } from '@styled-system/css'

export interface CharButtonProps {
  text: string
  active?: boolean
  onClick?: MouseEventHandler
}

export default function CharButton({ text, active, onClick }: CharButtonProps): JSX.Element {
  return (
    <TooltipButton text={text} active={active} onClick={onClick}>
      <span
        className={css({
          fontSize: 'xl'
        })}
      >
        {text.charAt(0)}
      </span>
    </TooltipButton>
  )
}
