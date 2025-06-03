import { ElementType } from 'react'
import BreadcrumbLink from './BreadcrumbLink'
import BreadcrumbItem from '../BreadcrumbItem'
import BreadcrumbSeparator from '../BreadcrumbSeparator'

interface PointLinkProps {
  text: string
  icon?: ElementType
  href?: string
}

export default function PointLink({ text, icon: Icon, href }: PointLinkProps) {
  return (
    <BreadcrumbItem>
      <BreadcrumbSeparator />
      {Icon && <Icon className="h-4 w-4" />}
      <BreadcrumbLink href={href}>{text}</BreadcrumbLink>
    </BreadcrumbItem>
  )
}
