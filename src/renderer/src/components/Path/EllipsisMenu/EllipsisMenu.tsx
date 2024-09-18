import { hstack } from '@styled-system/patterns'
import Link from '../Link'
import { Point } from '../store'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'
import MenuButton from './MenuButton'
import Separator from '../Separator'

export interface EllipsisMenuProps {
  points: Point[]
}

export default function EllipsisMenu({ points }: EllipsisMenuProps): JSX.Element {
  return (
    <div className={hstack({ gap: 2 })}>
      <Separator />
      <Popover>
        <PopoverTrigger>
          <Link text="..." />
        </PopoverTrigger>
        <PopoverContent>
          {points.map((point) => (
            <MenuButton key={point.url} icon={point.icon} href={point.url} text={point.text} />
          ))}
        </PopoverContent>
      </Popover>
    </div>
  )
}
