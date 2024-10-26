import { hstack } from '@styled-system/patterns'
import PopoverRoot from './Popover/PopoverRoot'
import PopoverContent from './Popover/PopoverContent'
import PopoverTrigger from './Popover/PopoverTrigger'
import MenuButton from './MenuButton'
import PointLink from './PointLink'
import { useAtomValue } from 'jotai'
import { midPointsAtom } from 'src/renderer/src/state/path.state'

export default function EllipsisMenu(): JSX.Element {
  const points = useAtomValue(midPointsAtom)

  return (
    <div className={hstack({ gap: 2 })}>
      <PopoverRoot>
        <PopoverTrigger>
          <PointLink text="..." />
        </PopoverTrigger>
        <PopoverContent>
          {points.map((point) => (
            <MenuButton key={point.url} icon={point.icon} href={point.url} text={point.text} />
          ))}
        </PopoverContent>
      </PopoverRoot>
    </div>
  )
}
