import { hstack } from '@styled-system/patterns'
import { useAtomValue } from 'jotai'
import { PropsWithChildren } from 'react'
import { depthAtom } from './store'

export interface TreeViewItemWrapperProps extends PropsWithChildren {
  nodeId: string
}

export default function TreeViewItemWrapper({
  nodeId,
  children
}: TreeViewItemWrapperProps): JSX.Element {
  const depth = useAtomValue(depthAtom(nodeId))

  return (
    <div
      className={hstack({
        gap: 1.5,
        alignItems: 'flex-start'
      })}
      style={{
        paddingLeft: `${depth * 1.5}rem`
      }}
    >
      {children}
    </div>
  )
}
