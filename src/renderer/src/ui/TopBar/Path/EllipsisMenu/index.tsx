import { hstack } from '@/styled-system/patterns'
import Popover from './Popover'
import MenuButton from './MenuButton'
import { useAtomValue } from 'jotai'
import { midPointsAtom } from '@/state/path.state'
import PointLink from '../PointLink'

export default function EllipsisMenu(): JSX.Element {
  const points = useAtomValue(midPointsAtom)

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
