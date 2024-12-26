import { useAtomValue } from 'jotai'
import EllipsisMenu from './EllipsisMenu'
import MidPointLink from './MidPointLink'
import { midPointLengthAtom } from '@/features/path/model'

export default function MidPathSegment(): JSX.Element | undefined {
  const length = useAtomValue(midPointLengthAtom)

  if (length === 0) {
    return undefined
  }

  if (length === 1) {
    return <MidPointLink />
  }

  return <EllipsisMenu />
}
