import PointLink from './shared/PointLink'

export default function FirstPointLink() {
  const point = undefined

  return point && <PointLink text={point.text} href={point.url} icon={point.icon} />
}
