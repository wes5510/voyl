import { useAtomValue } from 'jotai'
import PointLink from './PointLink'
import { lastPointAtom } from './store'

export default function FirstPointLink(): JSX.Element | undefined {
  const point = useAtomValue(lastPointAtom)
  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
