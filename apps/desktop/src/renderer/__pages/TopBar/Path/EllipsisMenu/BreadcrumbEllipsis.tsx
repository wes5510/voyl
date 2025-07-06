import { MoreHorizontal } from 'lucide-react'

export default function BreadcrumbEllipsis() {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className="flex size-9 items-center justify-center"
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}
