import { useAtomValue } from 'jotai'
import PointLink from './PointLink'
import { firstPointAtom } from './store'

export default function FirstPointLink(): JSX.Element | undefined {
  const point = useAtomValue(firstPointAtom)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
