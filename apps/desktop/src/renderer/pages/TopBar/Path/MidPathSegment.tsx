import EllipsisMenu from './EllipsisMenu'
import MidPointLink from './MidPointLink'

export default function MidPathSegment() {
  const length = 0

  if (length === 0) {
    return undefined
  }

  if (length === 1) {
    return <MidPointLink />
  }

  return <EllipsisMenu />
}
