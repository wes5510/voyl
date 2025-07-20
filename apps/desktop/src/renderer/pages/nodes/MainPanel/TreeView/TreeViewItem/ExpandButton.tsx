import { useState } from 'react'
import IconButton from './IconButton'
import CollapseIcon from '../shared/CollapseIcon'

export default function ExpandButton() {
  const [expanded, setExpanded] = useState(false)

  const handleClick = (): void => {
    const newExpanded = !expanded
    setExpanded(newExpanded)
  }

  return (
    <IconButton onClick={handleClick}>
      <CollapseIcon expanded={expanded} />
    </IconButton>
  )
}
