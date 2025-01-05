import { hstack } from '@/styled-system/patterns'
import Popover from './Popover'
import MenuButton from './MenuButton'
import PointLink from '../shared/PointLink'
import usePathStore, { getMidPoints } from '@/features/path/model'

export default function EllipsisMenu(): JSX.Element {
  const points = usePathStore(getMidPoints)

  return (
    <div className={hstack({ gap: 2 })}>
      <Popover.Root>
        <Popover.Trigger>
          <PointLink text="..." />
        </Popover.Trigger>
        <Popover.Content>
          {points.map((point) => (
            <MenuButton key={point.url} icon={point.icon} href={point.url} text={point.text} />
          ))}
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}
