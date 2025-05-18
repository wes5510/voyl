import { MouseEventHandler, ReactNode } from 'react'
import TooltipButton from '@/common/TooltipButton'

export interface IconButtonProps {
  icon: ReactNode
  text: string
  active?: boolean
  onClick?: MouseEventHandler
}

export default function IconButton({ icon, text, active, onClick }: IconButtonProps) {
  return (
    <TooltipButton text={text} active={active} onClick={onClick}>
      {icon}
    </TooltipButton>
  )
}
