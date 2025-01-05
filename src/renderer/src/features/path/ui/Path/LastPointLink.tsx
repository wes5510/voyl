import PointLink from './shared/PointLink'
import usePathStore, { getLastPoint } from '@/features/path/model'

export default function LastPointLink(): JSX.Element | undefined {
  const point = usePathStore(getLastPoint)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
