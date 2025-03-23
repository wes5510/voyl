import { MouseEventHandler, PropsWithChildren } from 'react'
import Tooltip from './Tooltip'
import cn from './cn'

export interface TooltipButtonProps extends PropsWithChildren {
  text: string
  active?: boolean
  onClick?: MouseEventHandler
}

export default function TooltipButton({ children, text, active, onClick }: TooltipButtonProps) {
  return (
    <Tooltip text={text}>
      <button
        className={cn(
          'flex h-10 w-10 cursor-pointer items-center justify-center transition duration-75 hover:bg-zinc-200/80',
          active && 'bg-zinc-200',
        )}
        onClick={onClick}
      >
        {children}
      </button>
    </Tooltip>
  )
}
