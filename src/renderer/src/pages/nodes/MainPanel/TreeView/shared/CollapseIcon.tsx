import { css } from '@/styled-system/css'
import ChevronRightIcon from '@/common/ChevronRightIcon'

export interface CollapseIconProps {
  expanded: boolean
}

export default function CollapseIcon({ expanded }: CollapseIconProps) {
  return (
    <ChevronRightIcon
      className={css({
        w: 4,
        h: 4,
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        translate: 'transform',
        transitionDuration: 'normal',
      })}
    />
  )
}
