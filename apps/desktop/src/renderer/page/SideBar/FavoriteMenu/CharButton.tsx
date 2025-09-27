import { MouseEventHandler } from 'react'
import TooltipButton from '@/renderer/common/TooltipButton'

export interface CharButtonProps {
  text: string
  active?: boolean
  onClick?: MouseEventHandler
}

export default function CharButton({ text, active, onClick }: CharButtonProps) {
  return (
    <TooltipButton text={text} active={active} onClick={onClick}>
      <span className="text-xl">{text.charAt(0)}</span>
    </TooltipButton>
  )
}
