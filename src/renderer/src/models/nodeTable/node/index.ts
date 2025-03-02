import { setTitle, TaskEntity } from './task'

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

export const setTaskTitle = ({
  entity,
  title,
}: {
  entity: NodeEntity
  title: string
}): NodeEntity => {
  return {
    ...entity,
    task: setTitle({ entity: entity.task, title }),
  }
}

export const getTaskTitle = ({ entity }: { entity: NodeEntity }): string => {
  return entity.task.title
}
