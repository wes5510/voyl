import { useAtomValue } from 'jotai'
import PointLink from './EllipsisMenu/PointLink'
import { lastPointAtom } from '../../../state/path.state'

export default function FirstPointLink(): JSX.Element | undefined {
  const point = useAtomValue(lastPointAtom)
  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
