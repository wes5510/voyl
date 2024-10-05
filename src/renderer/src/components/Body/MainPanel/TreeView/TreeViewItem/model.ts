import { v4 as uuid } from 'uuid'
export interface NodeModel {
  id: string
  depth: number
  collapsed: boolean
  text: string
}

export const createNewNode = ({ depth, text }: { depth: number; text: string }): NodeModel => ({
  id: uuid(),
  depth,
  collapsed: true,
  text
})

export const getDepthBySourceNode = ({
  collapsed,
  depth
}: {
  collapsed: boolean
  depth: number
}): number => (collapsed ? depth : depth + 1)
