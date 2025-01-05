import PointLink from './shared/PointLink'
import usePathStore, { getFirstPoint } from '@/features/path/model'

export default function FirstPointLink(): JSX.Element | undefined {
  const point = usePathStore(getFirstPoint)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
