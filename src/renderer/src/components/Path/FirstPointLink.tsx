import PointLink from './PointLink'
import usePathStore from './store'

export default function FirstPointLink(): JSX.Element | undefined {
  const point = usePathStore((store) => store.getFirstPoint(store.points))

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
