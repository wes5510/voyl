import { TaskEntity } from './task'

export interface NodeEntity {
  id: string
  parentId: string
  childrenIds: string[]
  depth: number
  collapsed: boolean
  index: number
  task: TaskEntity
}
