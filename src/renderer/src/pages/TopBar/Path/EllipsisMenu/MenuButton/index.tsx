import { ElementType } from 'react'
import DropdownMenuItem from './DropdownMenuItem'

interface MenuButtonProps {
  href: string
  text: string
  icon?: ElementType
}

export default function MenuButton({ href, text, icon: Icon }: MenuButtonProps) {
  return (
    <DropdownMenuItem asChild>
      <a href={href} className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="flex-1 truncate">{text}</span>
      </a>
    </DropdownMenuItem>
  )
}
