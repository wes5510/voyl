import { MouseEventHandler } from 'react'
import OneButton from './OneButton'
import { css } from '@styled-system/css'

export interface CharButtonProps {
  text: string
  active?: boolean
  onClick?: MouseEventHandler
}

export default function CharButton({ text, active, onClick }: CharButtonProps): JSX.Element {
  return (
    <OneButton text={text} active={active} onClick={onClick}>
      <span
        className={css({
          fontSize: 'xl'
        })}
      >
        {text.charAt(0)}
      </span>
    </OneButton>
  )
}
