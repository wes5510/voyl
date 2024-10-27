import { useAtomValue } from 'jotai'
import { firstPointAtom } from '@/src/renderer/src/state/path.state'
import PointLink from '../../../shared-components/PointLink'

export default function FirstPointLink(): JSX.Element | undefined {
  const point = useAtomValue(firstPointAtom)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
