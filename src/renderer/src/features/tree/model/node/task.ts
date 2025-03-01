export interface TaskEntity {
  id: string
  title: string
  done: boolean
}

export const updateTitle = ({
  entity,
  title,
}: {
  entity: TaskEntity
  title: string
}): TaskEntity => ({ ...entity, title })

export const truncateTitleAt = ({
  entity,
  index,
}: {
  entity: TaskEntity
  index: number
}): TaskEntity => updateTitle({ entity, title: entity.title.slice(0, index) })

export const updateDone = ({
  entity,
  done,
}: {
  entity: TaskEntity
  done: boolean
}): TaskEntity => ({ ...entity, done })
