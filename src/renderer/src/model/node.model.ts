import { v4 as uuid } from 'uuid'
export interface NodeModel {
  id: string
  depth: number
  collapsed: boolean
  text: string
}

export const createNewNode = ({
  depth,
  text,
  collapsed
}: {
  depth: number
  text?: string
  collapsed?: boolean
}): NodeModel => ({
  id: uuid(),
  depth,
  collapsed: collapsed ?? true,
  text: text ?? ''
})

export const getDepthBySourceNode = ({
  collapsed,
  depth
}: {
  collapsed: boolean
  depth: number
}): number => (collapsed ? depth : depth + 1)
