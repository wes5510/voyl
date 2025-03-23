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
      className="flex items-start gap-1.5"
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
