import PointLink from './shared/PointLink'
import { ElementType } from 'react'

export default function MidPointLink() {
  const point = undefined as { text: string; url: string; icon: ElementType } | undefined

  if (!point) return null
  return <PointLink text={point.text} href={point.url} icon={point.icon} />
}
