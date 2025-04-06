import usePathStore, { getMidPoints } from '@/models/path/store'
import BreadcrumbItem from '@/common/BreadcrumbItem'
import DropdownMenu from '@/common/DropdownMenu'
import BreadcrumbEllipsis from '@/common/BreadcrumbEllipsis'
import DropdownMenuContent from '@/common/DropdownMenuContent'
import MenuButton from './MenuButton'
import DropdownMenuTrigger from '@/common/DropdownMenuTrigger'

export default function EllipsisMenu() {
  const points = usePathStore(getMidPoints)

  return (
    <BreadcrumbItem>
      <span>/</span>
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
