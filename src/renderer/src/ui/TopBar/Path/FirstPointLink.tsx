import { useAtomValue } from 'jotai'
import PointLink from './EllipsisMenu/PointLink'
import { firstPointAtom } from 'src/renderer/src/state/path.state'

export default function FirstPointLink(): JSX.Element | undefined {
  const point = useAtomValue(firstPointAtom)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
