import usePathStore, { getFirstPoint } from '@/models/path/store'
import PointLink from './shared/PointLink'

export default function FirstPointLink() {
  const point = usePathStore(getFirstPoint)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
