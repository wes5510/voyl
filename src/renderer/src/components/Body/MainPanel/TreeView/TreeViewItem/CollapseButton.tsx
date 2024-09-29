import { MouseEventHandler } from 'react'
import ChevronRightIcon from '../../../../Icon/ChevronRightIcon'
import { css } from '@styled-system/css'
import IconButton from './IconButton'

export interface CollapseButtonProps {
  collapsed?: boolean
  onClick?: MouseEventHandler
}

export default function CollapseButton({
  collapsed = false,
  onClick
}: CollapseButtonProps): JSX.Element {
  return (
    <IconButton onClick={onClick}>
      <ChevronRightIcon
        className={css({
          w: 4,
          h: 4,
          transform: collapsed ? 'rotate(90deg)' : 'rotate(0deg)',
          translate: 'transform',
          transitionDuration: 'normal'
        })}
      />
    </IconButton>
  )
}
