import { MouseEventHandler } from 'react'
import IconButton from './IconButton'
import DotIcon from '../shared/DotIcon'

export interface DotButtonProps {
  onClick?: MouseEventHandler
}

export default function DotButton({ onClick, ...props }: DotButtonProps): JSX.Element {
  return (
    <IconButton onClick={onClick} {...props}>
      <DotIcon />
    </IconButton>
  )
}
