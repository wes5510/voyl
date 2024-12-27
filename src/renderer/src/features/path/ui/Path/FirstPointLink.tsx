import PointLink from './Path/shared/PointLink'
import usePathStore from '../model'
import { getFirstPoint } from '../model/path'

export default function FirstPointLink(): JSX.Element | undefined {
  const point = usePathStore(getFirstPoint)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
