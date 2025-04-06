import { ElementType } from 'react'
import BreadcrumbLink from '@/common/BreadcrumbLink'
import BreadcrumbItem from '@/common/BreadcrumbItem'

interface PointLinkProps {
  text: string
  icon?: ElementType
  href?: string
}

export default function PointLink({ text, icon: Icon, href }: PointLinkProps) {
  return (
    <BreadcrumbItem>
      <span>/</span>
      {Icon && <Icon className="h-4 w-4" />}
      <BreadcrumbLink href={href}>{text}</BreadcrumbLink>
    </BreadcrumbItem>
  )
}
