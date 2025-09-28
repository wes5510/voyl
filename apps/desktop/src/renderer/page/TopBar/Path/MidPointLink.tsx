import PointLink from './shared/PointLink'

export default function MidPointLink() {
  const point: { text: string; url: string; icon: string } | undefined = undefined

  return point ? <PointLink text={point.text} href={point.url} icon={point.icon} /> : null
}
