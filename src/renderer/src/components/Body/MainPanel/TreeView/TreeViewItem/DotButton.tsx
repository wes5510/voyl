import { MouseEventHandler } from 'react'
import IconButton from './IconButton'
import CircleIcon from '../../../../Icon/CircleIcon'
import { css } from '@styled-system/css'

export interface DotButtonProps {
  onClick?: MouseEventHandler
}

export default function DotButton({ onClick }: DotButtonProps): JSX.Element {
  return (
    <IconButton onClick={onClick}>
      <CircleIcon
        className={css({
          w: 1.5,
          h: 1.5
        })}
      />
    </IconButton>
  )
}
