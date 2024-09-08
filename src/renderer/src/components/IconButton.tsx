import { MouseEventHandler, ReactNode } from 'react'
import OneButton from './OneButton'

export interface IconButtonProps {
  icon: ReactNode
  text: string
  active?: boolean
  onClick?: MouseEventHandler
}

export default function IconButton({ icon, text, active, onClick }: IconButtonProps): JSX.Element {
  return (
    <OneButton text={text} active={active} onClick={onClick}>
      {icon}
    </OneButton>
  )
}
