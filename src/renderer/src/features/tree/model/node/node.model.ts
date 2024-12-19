import { v4 as uuid } from 'uuid'
export interface NodeModel {
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
}): NodeModel => ({
  id,
  depth,
  collapsed,
  title,
})

export const incrementDepth = ({ node }: { node: NodeModel }): NodeModel =>
  updateDepthByDelta({ node, depthDelta: 1 })

export const decrementDepth = ({ node }: { node: NodeModel }): NodeModel =>
  updateDepthByDelta({ node, depthDelta: -1 })

export const updateDepthByDelta = ({
  node,
  depthDelta,
}: {
  node: NodeModel
  depthDelta: number
}): NodeModel =>
  updateDepth({
    node,
    depth: node.depth + depthDelta,
  })

export const updateCollapsed = ({
  node,
  collapsed,
}: {
  node: NodeModel
  collapsed: boolean
}): NodeModel => ({ ...node, collapsed })

export const updateTitle = ({ node, title }: { node: NodeModel; title: string }): NodeModel => ({
  ...node,
  title,
})

export const updateDepth = ({ node, depth }: { node: NodeModel; depth: number }): NodeModel => ({
  ...node,
  depth,
})
