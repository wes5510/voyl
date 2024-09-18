import { EllipsisMenu } from './EllipsisMenu'
import PointLink from './PointLink'
import usePathStore from './store'

export default function MidPathSegment(): JSX.Element | undefined {
  const points = usePathStore((store) => store.getMidPoints(store.points))

  if (points.length === 0) {
    return undefined
  }

  if (points.length === 1) {
    return <PointLink icon={points[0].icon} text={points[0].text} href={points[0].url} />
  }

  return <EllipsisMenu points={points} />
}
