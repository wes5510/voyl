import PointLink from './shared/PointLink'
import usePathStore, { getMidPoint } from '@/models/path/store'

export default function MidPointLink() {
  const point = usePathStore(getMidPoint)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
