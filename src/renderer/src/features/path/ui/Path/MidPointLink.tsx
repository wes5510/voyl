import PointLink from './Path/shared/PointLink'
import usePathStore from '../model'
import { getMidPoint } from '../model/path'

export default function MidPointLink(): JSX.Element | undefined {
  const point = usePathStore(getMidPoint)

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
