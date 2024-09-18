import { ReactNode } from 'react'
import { hstack } from '@styled-system/patterns'
import Link from './Link'
import Separator from './Separator'

interface PointLinkProps {
  icon?: ReactNode
  text: string
  href: string
}

export default function PointLink(props: PointLinkProps): JSX.Element {
  return (
    <div className={hstack({ gap: 2 })}>
      <Separator />
      <Link {...props} />
    </div>
  )
}
