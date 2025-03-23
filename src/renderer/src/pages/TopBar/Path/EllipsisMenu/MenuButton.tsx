import { ElementType } from 'react'
import cn from '@/common/cn'

interface MenuButtonProps {
  href: string
  text: string
  icon?: ElementType
}

export default function MenuButton({ href, text, icon: Icon }: MenuButtonProps) {
  return (
    <a className={cn('flex w-full cursor-pointer gap-1 p-3 hover:bg-zinc-100')} href={href}>
      {Icon && <Icon className="h-4 w-4" />}
      <span className="flex-1 truncate">{text}</span>
    </a>
  )
}
