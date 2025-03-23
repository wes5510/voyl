import ChevronRightIcon from '@/common/ChevronRightIcon'

export interface CollapseIconProps {
  expanded: boolean
}

export default function CollapseIcon({ expanded }: CollapseIconProps) {
  return (
    <ChevronRightIcon
      className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-90' : 'rotate-0'}`}
    />
  )
}
