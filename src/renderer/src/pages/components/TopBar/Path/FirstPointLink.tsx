import { useAtomValue } from 'jotai'
import { firstPointAtom } from '@/features/path/model'
import PointLink from './shared/PointLink'

export default function FirstPointLink(): JSX.Element | undefined {
  const point = useAtomValue(firstPointAtom)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
