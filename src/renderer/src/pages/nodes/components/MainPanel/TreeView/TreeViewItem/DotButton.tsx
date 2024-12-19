import { MouseEventHandler } from 'react'
import IconButton from './IconButton'
import { css } from '@/styled-system/css'
import CircleIcon from 'src/renderer/src/common/CircleIcon'

export interface DotButtonProps {
  onClick?: MouseEventHandler
}

export default function DotButton({ onClick, ...props }: DotButtonProps): JSX.Element {
  return (
    <IconButton onClick={onClick} {...props}>
      <CircleIcon
        className={css({
          w: 1.5,
          h: 1.5,
        })}
      />
    </IconButton>
  )
}
