import PointLink from './shared/PointLink'
import usePathStore from '../../model'
import { getLastPoint } from '../../model/path'

export default function LastPointLink(): JSX.Element | undefined {
  const point = usePathStore(getLastPoint)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
