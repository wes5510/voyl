import { hstack } from '../../../../../styled-system/patterns/index.mjs'
import BreadcrumbItem from './BreadcrumbItem'
import { Item } from './types'
import BreadcrumbShortener from './BreadcrumbShortener'

const splitThreeParts = <T,>(
  array: T[]
): {
  first?: T
  middle?: T[]
  last?: T
} => {
  const arr = [...array]
  return {
    first: arr.length > 0 ? arr[0] : undefined,
    middle: arr.length > 2 ? arr.splice(1, arr.length - 2) : undefined,
    last: arr.length > 1 ? arr[arr.length - 1] : undefined
  }
}

interface BreadcrumbProps {
  items: Item[]
}

export default function Breadcrumb({ items }: BreadcrumbProps): JSX.Element {
  const { first, middle, last } = splitThreeParts(items)

  return (
    <div className={hstack({ gap: 1.5, fontSize: 'sm', color: 'zinc.700' })}>
      {first && <BreadcrumbItem text={first.text} href={first.href} icon={first.icon} />}
      {middle && middle.length === 1 && (
        <BreadcrumbItem text={middle[0].text} href={middle[0].href} />
      )}
      {middle && middle.length > 1 && <BreadcrumbShortener items={middle} />}
      {last && <BreadcrumbItem text={last.text} href={last.href} icon={last.icon} />}
    </div>
  )
}
