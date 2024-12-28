import { v4 as uuid } from 'uuid'

export interface NodeEntity {
  id: string
  depth: number
  collapsed: boolean
  title: string
}

export const createNewNode = ({
  depth = 0,
  id = uuid(),
  title = '',
  collapsed = true,
}: {
  depth?: number
  id?: string
  title?: string
  collapsed?: boolean
}): NodeEntity => ({
  id,
  depth,
  collapsed,
  title,
})

export const incrementDepth = ({ node }: { node: NodeEntity }): NodeEntity =>
  updateDepthByDelta({ node, depthDelta: 1 })

export const decrementDepth = ({ node }: { node: NodeEntity }): NodeEntity =>
  updateDepthByDelta({ node, depthDelta: -1 })

export const updateDepthByDelta = ({
  node,
  depthDelta,
}: {
  node: NodeEntity
  depthDelta: number
}): NodeEntity =>
  updateDepth({
    node,
    depth: node.depth + depthDelta,
  })

export const updateCollapsed = ({
  node,
  collapsed,
}: {
  node: NodeEntity
  collapsed: boolean
}): NodeEntity => ({ ...node, collapsed })

export const updateTitle = ({ node, title }: { node: NodeEntity; title: string }): NodeEntity => ({
  ...node,
  title,
})

export const updateDepth = ({ node, depth }: { node: NodeEntity; depth: number }): NodeEntity => ({
  ...node,
  depth,
})
