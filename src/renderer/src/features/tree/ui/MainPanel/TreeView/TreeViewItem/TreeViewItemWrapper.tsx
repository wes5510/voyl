import { hstack } from '@/styled-system/patterns'
import { ForwardedRef, forwardRef, PropsWithChildren } from 'react'
import { INDENT_WIDTH } from '../shared/const'
import useTreeStore, { getNodeDepth } from '@/features/tree/model'

export interface TreeViewItemWrapperProps extends PropsWithChildren {
  nodeId: string
  style?: React.CSSProperties
}

function TreeViewItemWrapper(
  { nodeId, style, children }: TreeViewItemWrapperProps,
  ref: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const depth = useTreeStore((state) => getNodeDepth({ entity: state, nodeId }))

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
