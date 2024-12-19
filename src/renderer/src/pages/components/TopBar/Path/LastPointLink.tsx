import { useAtomValue } from 'jotai'
import PointLink from './shared/PointLink'
import { lastPointAtom } from '@/features/path/model'

export default function FirstPointLink(): JSX.Element | undefined {
  const point = useAtomValue(lastPointAtom)
  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
