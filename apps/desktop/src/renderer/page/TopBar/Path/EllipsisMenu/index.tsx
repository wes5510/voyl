import BreadcrumbItem from '../shared/BreadcrumbItem'
import DropdownMenu from './DropdownMenu'
import BreadcrumbEllipsis from './BreadcrumbEllipsis'
import DropdownMenuContent from './DropdownMenuContent'
import MenuButton from './MenuButton'
import DropdownMenuTrigger from './DropdownMenuTrigger'
import BreadcrumbSeparator from '../shared/BreadcrumbSeparator'

export default function EllipsisMenu() {
  const points = []

  return (
    <BreadcrumbItem>
      <BreadcrumbSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex cursor-pointer items-center gap-1" aria-label="Toggle menu">
            <BreadcrumbEllipsis />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {points.map(({ url, icon, text }) => (
            <MenuButton key={url} icon={icon} href={url} text={text} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  )
}
