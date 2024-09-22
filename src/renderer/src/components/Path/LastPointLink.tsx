import PointLink from './PointLink'
import usePathStore, { Point } from './store'

const getLastPoint = (points: Point[]): Point | undefined =>
  points.length > 1 ? points[points.length - 1] : undefined

export default function FirstPointLink(): JSX.Element | undefined {
  const point = usePathStore((store) => getLastPoint(store.points))

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
