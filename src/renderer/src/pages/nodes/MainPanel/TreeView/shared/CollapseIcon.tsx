import { css } from '@/styled-system/css'
import ChevronRightIcon from '@/common/ChevronRightIcon'

export interface CollapseIconProps {
  collapsed: boolean
}

export default function CollapseIcon({ collapsed }: CollapseIconProps): JSX.Element {
  return (
    <ChevronRightIcon
      className={css({
        w: 4,
        h: 4,
        transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
        translate: 'transform',
        transitionDuration: 'normal',
      })}
    />
  )
}
