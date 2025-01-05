import PointLink from './shared/PointLink'
import usePathStore from '@/features/path/model'
import { getFirstPoint } from '@/features/path/model/path'

export default function FirstPointLink(): JSX.Element | undefined {
  const point = usePathStore(getFirstPoint)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
