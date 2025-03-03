import { hstack } from '@/styled-system/patterns'
import { ForwardedRef, forwardRef, PropsWithChildren } from 'react'
import { INDENT_WIDTH } from './const'

export interface TreeViewItemWrapperProps extends PropsWithChildren {
  depth: number
  style?: React.CSSProperties
}

function TreeViewItemWrapper(
  { depth, style, children }: TreeViewItemWrapperProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={hstack({
        gap: 1.5,
        alignItems: 'flex-start',
      })}
      style={{
        paddingLeft: `${depth * INDENT_WIDTH}px`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default forwardRef(TreeViewItemWrapper)
