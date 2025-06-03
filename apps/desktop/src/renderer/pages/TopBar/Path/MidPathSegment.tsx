import EllipsisMenu from './EllipsisMenu'
import MidPointLink from './MidPointLink'
import usePathStore, { getMidPointLength } from '@/renderer/models/path/store'

export default function MidPathSegment() {
  const length = usePathStore(getMidPointLength)

  if (length === 0) {
    return undefined
  }

  if (length === 1) {
    return <MidPointLink />
  }

  return <EllipsisMenu />
}
