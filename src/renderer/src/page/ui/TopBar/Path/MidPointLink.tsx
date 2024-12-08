import { midPointAtom } from '@/state/path.state'
import PointLink from './PointLink'
import { useAtomValue } from 'jotai'

export default function MidPointLink(): JSX.Element | undefined {
  const point = useAtomValue(midPointAtom)
  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
