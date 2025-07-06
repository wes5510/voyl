import cn from '@/renderer/common/shared/cn'
import { MouseEventHandler, PropsWithChildren } from 'react'

export interface IconButtonProps extends PropsWithChildren {
  className?: string
  onClick?: MouseEventHandler
}

export default function IconButton({ children, onClick, className, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        'flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition duration-75 hover:bg-zinc-200/80',
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
