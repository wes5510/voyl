import { INDENT_WIDTH } from './const'
import { center, hstack } from '@/styled-system/patterns'
import ChevronRightIcon from '@/shared/component/ChevronRightIcon'
import { css } from '@/styled-system/css'
import CircleIcon from '@/shared/component/CircleIcon'

export interface DraggingTreeviewItemProps {
  depth: number
  title: string
  collapsed: boolean
}

export default function DraggingTreeviewItem({
  depth,
  title,
  collapsed,
}: DraggingTreeviewItemProps): JSX.Element {
  return (
    <div
      className={hstack({
        gap: 1.5,
        alignItems: 'flex-start',
      })}
      style={{
        paddingLeft: `${depth * INDENT_WIDTH}px`,
      }}
    >
      <div className={center({ w: 6, h: 6 })}>
        <ChevronRightIcon
          className={css({
            w: 4,
            h: 4,
            transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
            translate: 'transform',
            transitionDuration: 'normal',
            alignSelf: 'center',
          })}
        />
      </div>
      <div className={center({ w: 6, h: 6 })}>
        <CircleIcon
          className={css({
            w: 1.5,
            h: 1.5,
            alignSelf: 'center',
          })}
        />
      </div>
      <div className={css({ flex: 1 })}>{title}</div>
    </div>
  )
}
