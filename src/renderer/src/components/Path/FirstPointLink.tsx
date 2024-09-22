import PointLink from './PointLink'
import usePathStore, { Point } from './store'

const getFirstPoint = (points: Point[]): Point | undefined =>
  points.length > 0 ? points[0] : undefined

export default function FirstPointLink(): JSX.Element | undefined {
  const point = usePathStore((store) => getFirstPoint(store.points))

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
