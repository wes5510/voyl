import PointLink from './shared/PointLink'
import usePathStore, { getMidPoint } from '@/features/path/model'

export default function MidPointLink(): JSX.Element | undefined {
  const point = usePathStore(getMidPoint)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
