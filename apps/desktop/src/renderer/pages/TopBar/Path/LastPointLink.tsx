import PointLink from './shared/PointLink'
import usePathStore, { getLastPoint } from '@/renderer/models/path/store'

export default function LastPointLink() {
  const point = usePathStore(getLastPoint)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
