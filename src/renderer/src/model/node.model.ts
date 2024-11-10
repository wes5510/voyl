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
