import { ReactNode } from 'react'
import { hstack } from '../../../../../styled-system/patterns/index.mjs'
import BreadcrumbLink from './BreadcrumbLink'

interface BreadcrumbItemProps {
  icon?: ReactNode
  text: string
  href: string
}

export default function BreadcrumbItem({ icon, text, href }: BreadcrumbItemProps): JSX.Element {
  return (
    <div className={hstack({ gap: 2 })}>
      <span>/</span>
      <BreadcrumbLink icon={icon} text={text} href={href} />
    </div>
  )
}
