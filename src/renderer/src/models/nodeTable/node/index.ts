import { TaskEntity } from './task'

export interface NodeEntity {
  id: string
  prevSiblingNodeId?: string
  nextSiblingNodeId?: string
  parentNodeId?: string
  childNodeIds: string[]
  collapsed: boolean
  task: TaskEntity
}

export const toggleCollapsed = ({ entity }: { entity: NodeEntity }): NodeEntity => {
  return {
    ...entity,
    collapsed: !entity.collapsed,
  }
}
