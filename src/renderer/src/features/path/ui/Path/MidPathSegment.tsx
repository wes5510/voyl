import EllipsisMenu from './EllipsisMenu'
import MidPointLink from './MidPointLink'
import usePathStore from '@/features/path/model'
import { getMidPointLength } from '../../model/path'

export default function MidPathSegment(): JSX.Element | undefined {
  const length = usePathStore(getMidPointLength)

  if (length === 0) {
    return undefined
  }

  if (length === 1) {
    return <MidPointLink />
  }

  return <EllipsisMenu />
}
